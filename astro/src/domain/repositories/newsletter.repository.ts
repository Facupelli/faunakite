import type { NewsletterSubscription } from "../entities/newsletter";

export interface NewsletterRepository {
  create(subscription: NewsletterSubscription): Promise<string>;
  findByEmail(email: string): Promise<NewsletterSubscription | null>;
  findAll(): Promise<NewsletterSubscription[]>;
  findActive(): Promise<NewsletterSubscription[]>;
}
