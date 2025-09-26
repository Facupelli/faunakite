export abstract class BookingDomainError extends Error {
  abstract readonly code: string;

  readonly context?: Record<string, unknown>;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    this.context = context;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when a booking conflicts with existing bookings
 * E.g., same customer trying to book overlapping dates
 */
export class BookingConflictError extends BookingDomainError {
  readonly code = "BOOKING_CONFLICT";

  constructor(
    customerEmail: string,
    conflictingDates: { startDate: Date; endDate: Date },
    existingBookingId?: string
  ) {
    super(
      `Customer ${customerEmail} already has a booking that conflicts with the requested dates`,
      {
        customerEmail,
        conflictingDates,
        existingBookingId,
      }
    );
  }
}

/**
 * Thrown when a booking slot has reached capacity
 * E.g., too many students already booked for a specific date/course
 */
export class SlotUnavailableError extends BookingDomainError {
  readonly code = "SLOT_UNAVAILABLE";

  constructor(
    courseType: string,
    requestedDate: Date,
    requestedStudents: number,
    availableCapacity: number
  ) {
    super(
      `Not enough capacity for ${courseType} on ${requestedDate.toDateString()}. Requested: ${requestedStudents}, Available: ${availableCapacity}`,
      {
        courseType,
        requestedDate,
        requestedStudents,
        availableCapacity,
      }
    );
  }
}

/**
 * Thrown when booking is outside allowed time window
 * E.g., booking too far in advance or too close to course date
 */
export class InvalidBookingWindowError extends BookingDomainError {
  readonly code = "INVALID_BOOKING_WINDOW";

  constructor(
    courseDate: Date,
    bookingDate: Date,
    reason: "TOO_EARLY" | "TOO_LATE"
  ) {
    const reasonText =
      reason === "TOO_EARLY"
        ? "too far in advance"
        : "too close to course date";

    super(
      `Cannot book course for ${courseDate.toDateString()} - booking ${reasonText}`,
      {
        courseDate,
        bookingDate,
        reason,
      }
    );
  }
}

/**
 * Thrown when booking dates are logically invalid
 * E.g., end date before start date, dates in the past
 */
export class InvalidBookingDateError extends BookingDomainError {
  readonly code = "INVALID_BOOKING_DATE";

  constructor(
    startDate: Date,
    endDate: Date,
    reason: "END_BEFORE_START" | "DATES_IN_PAST"
  ) {
    const reasonText =
      reason === "END_BEFORE_START"
        ? "end date is before start date"
        : "dates are in the past";

    super(`Invalid booking dates: ${reasonText}`, {
      startDate,
      endDate,
      reason,
    });
  }
}

/**
 * Thrown when a booking is not found
 * Used by use cases when a booking operation requires an existing booking
 */
export class BookingNotFoundError extends BookingDomainError {
  readonly code = "BOOKING_NOT_FOUND";

  constructor(bookingId: string) {
    super(`Booking with ID ${bookingId} was not found`, { bookingId });
  }
}

/**
 * Thrown when customer data is invalid
 * E.g., invalid email format, missing required fields
 */
export class InvalidCustomerDataError extends BookingDomainError {
  readonly code = "INVALID_CUSTOMER_DATA";

  constructor(field: string, value: unknown, reason: string) {
    super(`Invalid customer data for field '${field}': ${reason}`, {
      field,
      value,
      reason,
    });
  }
}

/**
 * Thrown when booking operation is not allowed due to current booking state
 * E.g., trying to modify a completed booking, cancelling a cancelled booking
 */
export class InvalidBookingStateError extends BookingDomainError {
  readonly code = "INVALID_BOOKING_STATE";

  constructor(
    bookingId: string,
    currentState: string,
    attemptedOperation: string
  ) {
    super(
      `Cannot ${attemptedOperation} booking ${bookingId} - current state is ${currentState}`,
      {
        bookingId,
        currentState,
        attemptedOperation,
      }
    );
  }
}

export type BookingDomainErrors =
  | BookingConflictError
  | SlotUnavailableError
  | InvalidBookingWindowError
  | InvalidBookingDateError
  | BookingNotFoundError
  | InvalidCustomerDataError
  | InvalidBookingStateError;
