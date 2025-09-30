import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { subscribeNewsletterUseCase } from "../domain/use-cases/subscribe-to-newsletter";
import { GoogleSheetsClient } from "../infrastructure/google-sheets/google-sheet-client";
import { GoogleSheetsNewsletterRepository } from "../infrastructure/google-sheets/google-sheet-newsletter.repository";

export const newsletter = {
  subscribe: defineAction({
    accept: "form",
    input: z.object({
      email: z.string().email("Please enter a valid email address"),
      name: z.string().optional(),
      source: z.string().optional().default("website"),
    }),
    handler: async (input) => {
      try {
        const repository = createNewsletterRepository();
        const dependencies = { newsletterRepository: repository };

        const result = await subscribeNewsletterUseCase(dependencies, {
          email: input.email,
          name: input.name,
          source: input.source,
        });

        return {
          success: true,
          message: result.message,
          subscriptionId: result.subscriptionId,
        };
      } catch (error) {
        console.error("Newsletter subscription error:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to subscribe to newsletter. Please try again.";

        throw new Error(errorMessage);
      }
    },
  }),
};

function createNewsletterRepository() {
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

  return new GoogleSheetsNewsletterRepository(client);
}
