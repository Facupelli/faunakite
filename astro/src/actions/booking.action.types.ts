import type { ProblemDetails } from "../problem-details";

export type StepResult = {
  success: boolean;
  error?: ProblemDetails;
};

export type BookingContext = {
  correlation_id: string;
  booking_id?: string;
  customer_email: string;
  arrival_date: string;
  departure_date: string;
  locale: string;
  started_at: number;
  result: "success" | "failure";
  steps: {
    captcha_verification?: StepResult;
    booking_creation?: StepResult;
    calendar_event?: StepResult;
    qr_generation?: StepResult;
    email_delivery?: StepResult;
  };
  degraded_services: string[];
  error_type?: string;
  error_message?: string;
};

export function logCanonicalLine(context: BookingContext): void {
  const duration_ms = Date.now() - context.started_at;

  const canonicalLog = {
    // Core identity
    correlation_id: context.correlation_id,
    booking_id: context.booking_id,

    // Request context
    customer_email: context.customer_email,
    arrival_date: context.arrival_date,
    departure_date: context.departure_date,
    locale: context.locale,

    // Execution metrics
    duration_ms,
    result: context.result,

    // Step-by-step outcomes
    steps: context.steps,

    // Service degradation tracking
    degraded_services: context.degraded_services,

    // Error details (if applicable)
    ...(context.error_type && {
      error_type: context.error_type,
      error_message: context.error_message,
    }),
  };

  console.log(`[CANONICAL_BOOKING_LOG] ${JSON.stringify(canonicalLog)}`);
}
