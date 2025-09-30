export interface NewsletterSubscription {
  id?: string;
  email: string;
  name?: string;
  subscribedAt: Date;
  status: SubscriptionStatus;
  source?: string;
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  UNSUBSCRIBED = "unsubscribed",
}

export interface CreateNewsletterSubscriptionData {
  email: string;
  name?: string;
  source?: string;
}

export function createNewsletterSubscription(
  data: CreateNewsletterSubscriptionData
): NewsletterSubscription {
  return {
    ...data,
    status: SubscriptionStatus.ACTIVE,
    subscribedAt: new Date(),
  };
}
