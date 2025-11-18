import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { createSubscriber } from "../newsletter/sender-net/utils";

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
        const result = await createSubscriber({
          email: input.email,
          firstname: input.name,
        });

        if (!result.success) {
          throw new Error(result.message);
        }

        return {
          success: true,
          message: result.message,
          subscriptionId: result.data.id,
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
