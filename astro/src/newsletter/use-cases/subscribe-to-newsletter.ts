import { GoogleSheetsNewsletterRepository } from "../google-sheets/google-sheet-newsletter.repository";
import { createSubscribeNewsletterUseCaseFactory } from "./subscribe-to-newsletter.use-case";

export const subscribeToNewsletter = createSubscribeNewsletterUseCaseFactory({
  newsletterRepository: GoogleSheetsNewsletterRepository,
});
