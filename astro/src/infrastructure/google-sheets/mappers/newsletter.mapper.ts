import {
  SubscriptionStatus,
  type NewsletterSubscription,
} from "../../../domain/entities/newsletter";

export class NewsletterMapper {
  toSpreadsheetRow(subscription: NewsletterSubscription): unknown[] {
    return [
      subscription.id || "",
      subscription.email,
      subscription.name || "",
      subscription.subscribedAt.toISOString(),
      subscription.status,
      subscription.source || "",
    ];
  }

  fromSpreadsheetRow(row: unknown[]): NewsletterSubscription | null {
    if (!row || row.length < 4) return null;

    const id = this.extractString(row[0]);
    const email = this.extractString(row[1]);
    const subscribedAt = this.parseDate(row[3]);
    const status = this.extractStatus(row[4]);

    if (!id || !email || !subscribedAt || !status) return null;

    return {
      id,
      email,
      name: this.extractString(row[2]) || undefined,
      subscribedAt,
      status,
      source: this.extractString(row[5]) || undefined,
    };
  }

  fromSpreadsheetRows(rows: unknown[][]): NewsletterSubscription[] {
    return rows
      .map((row) => this.fromSpreadsheetRow(row))
      .filter((sub): sub is NewsletterSubscription => sub !== null);
  }

  private extractString(value: unknown): string | null {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    return str === "" ? null : str;
  }

  private parseDate(value: unknown): Date | null {
    if (!value) return null;
    if (typeof value === "string") {
      const date = new Date(value);
      return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }

  private extractStatus(value: unknown): SubscriptionStatus | null {
    const str = this.extractString(value);
    if (!str) return null;
    return Object.values(SubscriptionStatus).includes(str as SubscriptionStatus)
      ? (str as SubscriptionStatus)
      : null;
  }
}
