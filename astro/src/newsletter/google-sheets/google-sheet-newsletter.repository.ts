import { v4 as uuidv4 } from "uuid";
import {
  GoogleSheetsClient,
  GoogleSheetsError,
} from "../../booking/google-sheets/google-sheet-client";
import type { NewsletterSubscription } from "../newsletter.entity";
import { newsletterMapper } from "./mappers/newsletter.mapper";
import type { NewsletterRepository } from "../newsletter.repository";

const spreadsheetId = import.meta.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const sheetName = "Newsletter";
const clientEmail = import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

if (!spreadsheetId || !clientEmail || !privateKey) {
  throw new Error("Missing required Google Sheets configuration");
}

const client = new GoogleSheetsClient({
  spreadsheetId,
  sheetName,
  credentials: {
    client_email: clientEmail,
    private_key: privateKey.replace(/\\n/g, "\n"),
  },
});

export const GoogleSheetsNewsletterRepository: NewsletterRepository = {
  // async initialize(): Promise<void> {
  //   try {
  //     const headers = [
  //       "id",
  //       "email",
  //       "name",
  //       "subscribedAt",
  //       "status",
  //       "source",
  //     ];
  //     const existingHeaders = await client.readHeaders();
  //     if (existingHeaders.length === 0) {
  //       await client.updateRange("A1:F1", [headers]);
  //     }
  //   } catch (error) {
  //     throw new Error(`Failed to initialize newsletter repository: ${error}`);
  //   }
  // },

  async create(subscription: NewsletterSubscription): Promise<string> {
    try {
      const subscriptionWithId: NewsletterSubscription = {
        ...subscription,
        id: subscription.id || uuidv4(),
      };

      const row = newsletterMapper.toSpreadsheetRow(subscriptionWithId);
      await client.appendRows([row]);

      return subscriptionWithId.id!;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to create newsletter subscription: ${error.message}`
        );
      }
      throw error;
    }
  },

  async findByEmail(email: string): Promise<NewsletterSubscription | null> {
    try {
      const rows = await client.readAllData();
      const subscriptions = newsletterMapper.fromSpreadsheetRows(rows);

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
  },

  async findAll(): Promise<NewsletterSubscription[]> {
    try {
      const rows = await client.readAllData();
      return newsletterMapper.fromSpreadsheetRows(rows);
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to find all subscriptions: ${error.message}`);
      }
      throw error;
    }
  },

  async findActive(): Promise<NewsletterSubscription[]> {
    try {
      const rows = await client.readAllData();
      const subscriptions = newsletterMapper.fromSpreadsheetRows(rows);

      return subscriptions.filter((sub) => sub.status === "active");
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find active subscriptions: ${error.message}`
        );
      }
      throw error;
    }
  },
};
