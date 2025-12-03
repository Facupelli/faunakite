import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { createSubscriber } from "../modules/newsletter/sender-net/utils";
import { TURNSTILE_NEWSLETTER_SECRET_KEY } from "astro:env/server";

export const newsletter = {
  subscribe: defineAction({
    accept: "form",
    input: z.object({
      "cf-turnstile-response": z
        .string()
        .min(1, "Captcha verification required"),
      email: z.string().email("Please enter a valid email address"),
      name: z.string().optional(),
      source: z.string().optional().default("website"),
    }),
    handler: async (input) => {
      const turnstileToken = input["cf-turnstile-response"];

      try {
        const verificationResponse = await fetch(
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              secret: TURNSTILE_NEWSLETTER_SECRET_KEY,
              response: turnstileToken,
            }),
          }
        );

        const verification = await verificationResponse.json();

        if (!verification.success) {
          throw new Error("Captcha verification failed");
        }
      } catch (error) {
        console.error("Turnstile validation error:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Captcha Error",
        });
      }

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
