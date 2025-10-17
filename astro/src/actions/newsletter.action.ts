import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { subscribeToNewsletter } from "../newsletter/use-cases/subscribe-to-newsletter";

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
        const result = await subscribeToNewsletter({
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
