import {
  BookingConflictError,
  InvalidBookingDateError,
  BookingNotFoundError,
  InvalidBookingStateError,
  InvalidBookingWindowError,
  InvalidCustomerDataError,
  SlotUnavailableError,
  type BookingDomainErrors,
} from "../booking/booking.errors";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { ActionError } from "astro:actions";
import { createBooking } from "../booking/use-cases/create-booking";

interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const book = {
  createBooking: defineAction({
    accept: "form",
    input: z.object({
      customerEmail: z.string(),
      customerName: z.string(),
      customerPhone: z.string().optional(),
      courseType: z.string(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
      packDuration: z.coerce.number(),
    }),
    handler: async (input) => {
      try {
        const result = await createBooking(input);

        return {
          bookingId: result.bookingId,
          message: result.message,
        };
      } catch (error) {
        console.error("Booking API Error:", error);

        if (
          error instanceof BookingConflictError ||
          error instanceof InvalidBookingDateError ||
          error instanceof InvalidCustomerDataError ||
          error instanceof InvalidBookingWindowError ||
          error instanceof SlotUnavailableError ||
          error instanceof BookingNotFoundError ||
          error instanceof InvalidBookingStateError
        ) {
          const errorResponse = handleDomainError(error as BookingDomainErrors);

          throw new ActionError({
            code: "BAD_REQUEST",
            message: errorResponse.message,
          });
        }

        // Handle validation errors (request parsing)
        if (error instanceof Error && error.message.includes("Invalid")) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }

        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred. Please try again later.",
        });
      }
    },
  }),
};

function handleDomainError(error: BookingDomainErrors): ErrorResponse {
  switch (error.code) {
    case "BOOKING_CONFLICT":
      return {
        code: "BOOKING_CONFLICT",
        message:
          "You already have a booking for these dates. Please choose different dates or cancel your existing booking.",
        details: error.context,
      };

    case "SLOT_UNAVAILABLE":
      return {
        code: "SLOT_UNAVAILABLE",
        message:
          "Sorry, there are not enough spots available for your requested dates. Please try different dates or reduce the number of students.",
        details: error.context,
      };

    case "INVALID_BOOKING_WINDOW":
      const windowError =
        error.context?.reason === "TOO_EARLY"
          ? "Bookings can only be made up to 90 days in advance."
          : "Bookings must be made at least 24 hours before the course date.";

      return {
        code: "INVALID_BOOKING_WINDOW",
        message: windowError,
        details: error.context,
      };

    case "INVALID_BOOKING_DATE":
      const dateError =
        error.context?.reason === "END_BEFORE_START"
          ? "Course end date must be after the start date."
          : "Course dates must be in the future.";

      return {
        code: "INVALID_BOOKING_DATE",
        message: dateError,
        details: error.context,
      };

    case "INVALID_CUSTOMER_DATA":
      return {
        code: "INVALID_CUSTOMER_DATA",
        message: `Please check your ${error.context?.field}: ${error.context?.reason}`,
        details: error.context,
      };

    case "BOOKING_NOT_FOUND":
      return {
        code: "BOOKING_NOT_FOUND",
        message: "The requested booking could not be found.",
        details: error.context,
      };

    case "INVALID_BOOKING_STATE":
      return {
        code: "INVALID_BOOKING_STATE",
        message: "This booking cannot be modified in its current state.",
        details: error.context,
      };

    default:
      return {
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred. Please try again.",
      };
  }
}
