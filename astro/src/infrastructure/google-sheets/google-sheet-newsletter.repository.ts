import { v4 as uuidv4 } from "uuid";
import {
  GoogleSheetsError,
  type GoogleSheetsClient,
} from "./google-sheet-client";
import type { NewsletterSubscription } from "../../domain/entities/newsletter";
import type { NewsletterRepository } from "../../domain/repositories/newsletter.repository";
import { NewsletterMapper } from "./mappers/newsletter.mapper";

export class GoogleSheetsNewsletterRepository implements NewsletterRepository {
  private client: GoogleSheetsClient;
  private mapper: NewsletterMapper;

  constructor(client: GoogleSheetsClient) {
    this.client = client;
    this.mapper = new NewsletterMapper();
  }

  async initialize(): Promise<void> {
    try {
      const headers = [
        "id",
        "email",
        "name",
        "subscribedAt",
        "status",
        "source",
      ];
      const existingHeaders = await this.client.readHeaders();
      if (existingHeaders.length === 0) {
        await this.client.updateRange("A1:F1", [headers]);
      }
    } catch (error) {
      throw new Error(`Failed to initialize newsletter repository: ${error}`);
    }
  }

  async create(subscription: NewsletterSubscription): Promise<string> {
    try {
      const subscriptionWithId: NewsletterSubscription = {
        ...subscription,
        id: subscription.id || uuidv4(),
      };

      const row = this.mapper.toSpreadsheetRow(subscriptionWithId);
      await this.client.appendRows([row]);

      return subscriptionWithId.id!;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to create newsletter subscription: ${error.message}`
        );
      }
      throw error;
    }
  }

  async findByEmail(email: string): Promise<NewsletterSubscription | null> {
    try {
      const rows = await this.client.readAllData();
      const subscriptions = this.mapper.fromSpreadsheetRows(rows);

      return (
        subscriptions.find(
          (sub) => sub.email.toLowerCase() === email.toLowerCase()
        ) || null
      );
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find subscription by email: ${error.message}`
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<NewsletterSubscription[]> {
    try {
      const rows = await this.client.readAllData();
      return this.mapper.fromSpreadsheetRows(rows);
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to find all subscriptions: ${error.message}`);
      }
      throw error;
    }
  }

  async findActive(): Promise<NewsletterSubscription[]> {
    try {
      const rows = await this.client.readAllData();
      const subscriptions = this.mapper.fromSpreadsheetRows(rows);

      return subscriptions.filter((sub) => sub.status === "active");
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find active subscriptions: ${error.message}`
        );
      }
      throw error;
    }
  }
}
