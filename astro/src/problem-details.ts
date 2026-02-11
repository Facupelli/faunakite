/**
 * RFC 9457 Problem Details for HTTP APIs
 * https://www.rfc-editor.org/rfc/rfc9457.html
 *
 * Provides a standardized way to carry machine-readable details of errors
 * in HTTP response content to avoid the need to define new error response
 * formats for HTTP APIs.
 */

import type { ActionErrorCode } from "astro:actions";

/**
 * Standard Problem Details structure per RFC 9457
 */
export interface ProblemDetails {
  /** A URI reference that identifies the problem type */
  type: string;
  /** A short, human-readable summary of the problem type */
  title: string;
  /** The HTTP status code */
  status: number;
  /** A human-readable explanation specific to this occurrence */
  detail: string;
  /** A URI reference that identifies the specific occurrence */
  instance: string;
  /** Correlation ID for tracking this error across systems */
  correlationId: string;
  /** ISO 8601 timestamp when the error occurred */
  timestamp: string;
  /** Additional extension members */
  [key: string]: unknown;
}

/**
 * Extended Problem Details specifically for booking errors
 */
export interface BookingProblemDetails extends ProblemDetails {
  /** Which step in the booking process failed */
  bookingStep:
    | "captcha_verification"
    | "booking_creation"
    | "calendar_event"
    | "qr_generation"
    | "email_delivery";
  /** User-facing error code for i18n */
  userErrorCode?: string;
  /** Sanitized input data (no sensitive info) */
  context?: Record<string, unknown>;
}

/**
 * Maps Astro ActionErrorCode to HTTP status numbers
 */
const ACTION_CODE_TO_STATUS: Record<ActionErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

/**
 * Problem type URIs - these can be expanded to full documentation URLs
 * For now using relative URIs, but in production you'd use:
 * https://yourdomain.com/docs/errors/captcha-verification-failed
 */
const PROBLEM_TYPES = {
  CAPTCHA_VERIFICATION_FAILED: "/errors/captcha-verification-failed",
  BOOKING_CREATION_FAILED: "/errors/booking-creation-failed",
  CALENDAR_EVENT_FAILED: "/errors/calendar-event-failed",
  QR_GENERATION_FAILED: "/errors/qr-generation-failed",
  EMAIL_DELIVERY_FAILED: "/errors/email-delivery-failed",
  INVALID_INPUT: "/errors/invalid-input",
  INTERNAL_ERROR: "/errors/internal-server-error",
} as const;

/**
 * Generates a unique correlation ID for tracking errors
 * Format: timestamp-random (e.g., 1234567890-a1b2c3d4)
 */
export function generateCorrelationId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Creates a Problem Details object for captcha verification failures
 */
export function createCaptchaVerificationProblem(
  detail: string,
  correlationId: string,
): BookingProblemDetails {
  return {
    type: PROBLEM_TYPES.CAPTCHA_VERIFICATION_FAILED,
    title: "Captcha Verification Failed",
    status: 400,
    detail,
    instance: `/booking/${correlationId}`,
    correlationId,
    timestamp: new Date().toISOString(),
    bookingStep: "captcha_verification",
    userErrorCode: "CAPTCHA_FAILED",
  };
}

/**
 * Creates a Problem Details object for booking creation failures
 */
export function createBookingCreationProblem(
  detail: string,
  correlationId: string,
  context?: Record<string, unknown>,
): BookingProblemDetails {
  return {
    type: PROBLEM_TYPES.BOOKING_CREATION_FAILED,
    title: "Booking Creation Failed",
    status: 500,
    detail,
    instance: `/booking/${correlationId}`,
    correlationId,
    timestamp: new Date().toISOString(),
    bookingStep: "booking_creation",
    userErrorCode: "BOOKING_FAILED",
    context,
  };
}

/**
 * Creates a Problem Details object for calendar event failures (degraded service)
 */
export function createCalendarEventProblem(
  detail: string,
  correlationId: string,
  bookingId?: string,
): BookingProblemDetails {
  return {
    type: PROBLEM_TYPES.CALENDAR_EVENT_FAILED,
    title: "Calendar Event Creation Failed",
    status: 500,
    detail,
    instance: `/booking/${correlationId}`,
    correlationId,
    timestamp: new Date().toISOString(),
    bookingStep: "calendar_event",
    bookingId, // Booking succeeded, so we have an ID
  };
}

export function createQRGenerationProblem(
  detail: string,
  correlationId: string,
  bookingId?: string,
): BookingProblemDetails {
  return {
    type: PROBLEM_TYPES.QR_GENERATION_FAILED,
    title: "QR Code Generation Failed",
    status: 500,
    detail,
    instance: `/booking/${correlationId}`,
    correlationId,
    timestamp: new Date().toISOString(),
    bookingStep: "qr_generation",
    bookingId, // Booking succeeded, so we have an ID
  };
}

/**
 * Creates a Problem Details object for email delivery failures (degraded service)
 */
export function createEmailDeliveryProblem(
  detail: string,
  correlationId: string,
  bookingId?: string,
  customerEmail?: string,
): BookingProblemDetails {
  return {
    type: PROBLEM_TYPES.EMAIL_DELIVERY_FAILED,
    title: "Email Delivery Failed",
    status: 500,
    detail,
    instance: `/booking/${correlationId}`,
    correlationId,
    timestamp: new Date().toISOString(),
    bookingStep: "email_delivery",
    bookingId,
    customerEmail, // Include for admin to manually send email
  };
}

/**
 * Creates a Problem Details object for invalid input
 */
export function createInvalidInputProblem(
  detail: string,
  correlationId: string,
  validationErrors?: unknown,
): BookingProblemDetails {
  return {
    type: PROBLEM_TYPES.INVALID_INPUT,
    title: "Invalid Input",
    status: 400,
    detail,
    instance: `/booking/${correlationId}`,
    correlationId,
    timestamp: new Date().toISOString(),
    bookingStep: "booking_creation",
    userErrorCode: "INVALID_INPUT",
    validationErrors,
  };
}

/**
 * Creates a generic Problem Details object for internal server errors
 */
export function createInternalServerProblem(
  detail: string,
  correlationId: string,
  errorStep?: BookingProblemDetails["bookingStep"],
): BookingProblemDetails {
  return {
    type: PROBLEM_TYPES.INTERNAL_ERROR,
    title: "Internal Server Error",
    status: 500,
    detail,
    instance: `/booking/${correlationId}`,
    correlationId,
    timestamp: new Date().toISOString(),
    bookingStep: errorStep || "booking_creation",
    userErrorCode: "INTERNAL_ERROR",
  };
}

/**
 * Converts an ActionErrorCode to its HTTP status number
 */
export function getStatusFromCode(code: ActionErrorCode): number {
  return ACTION_CODE_TO_STATUS[code] || 500;
}

/**
 * Formats a Problem Details object as a human-readable string for logging
 */
export function formatProblemForLog(problem: ProblemDetails): string {
  return `[${problem.status}] ${problem.title}
  Type: ${problem.type}
  Detail: ${problem.detail}
  Instance: ${problem.instance}
  Correlation ID: ${problem.correlationId}
  Timestamp: ${problem.timestamp}`;
}
