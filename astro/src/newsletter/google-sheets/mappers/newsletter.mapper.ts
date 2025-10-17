import {
  SubscriptionStatus,
  type NewsletterSubscription,
} from "../../newsletter.entity";

export const newsletterMapper = {
  toSpreadsheetRow(subscription: NewsletterSubscription): unknown[] {
    return [
      subscription.id || "",
      subscription.email,
      subscription.name || "",
      subscription.subscribedAt.toISOString(),
      subscription.status,
      subscription.source || "",
    ];
  },

  fromSpreadsheetRow(row: unknown[]): NewsletterSubscription | null {
    if (!row || row.length < 4) return null;

    const id = extractString(row[0]);
    const email = extractString(row[1]);
    const subscribedAt = parseDate(row[3]);
    const status = extractStatus(row[4]);

    if (!id || !email || !subscribedAt || !status) return null;

    return {
      id,
      email,
      name: extractString(row[2]) || undefined,
      subscribedAt,
      status,
      source: extractString(row[5]) || undefined,
    };
  },

  fromSpreadsheetRows(rows: unknown[][]): NewsletterSubscription[] {
    return rows
      .map((row) => newsletterMapper.fromSpreadsheetRow(row))
      .filter((sub): sub is NewsletterSubscription => sub !== null);
  },
};

function extractString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  return str === "" ? null : str;
}

function parseDate(value: unknown): Date | null {
  if (!value) return null;
  if (typeof value === "string") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function extractStatus(value: unknown): SubscriptionStatus | null {
  const str = extractString(value);
  if (!str) return null;
  return Object.values(SubscriptionStatus).includes(str as SubscriptionStatus)
    ? (str as SubscriptionStatus)
    : null;
}
