import {
  createNewsletterSubscription,
  SubscriptionStatus,
  type CreateNewsletterSubscriptionData,
} from "../entities/newsletter";
import type { NewsletterRepository } from "../repositories/newsletter.repository";

export interface SubscribeNewsletterDependencies {
  newsletterRepository: NewsletterRepository;
}

export async function subscribeNewsletterUseCase(
  dependencies: SubscribeNewsletterDependencies,
  input: CreateNewsletterSubscriptionData
): Promise<{ subscriptionId: string; message: string }> {
  const { newsletterRepository } = dependencies;

  const existing = await newsletterRepository.findByEmail(input.email);
  if (existing && existing.status === SubscriptionStatus.ACTIVE) {
    throw new Error("This email is already subscribed to our newsletter");
  }

  const subscription = createNewsletterSubscription(input);
  const subscriptionId = await newsletterRepository.create(subscription);

  return {
    subscriptionId,
    message: "Successfully subscribed to newsletter!",
  };
}
