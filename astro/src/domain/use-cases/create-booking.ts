import {
  createBooking,
  type Booking,
  type CreateBookingData,
} from "../entities/booking";
import {
  BookingConflictError,
  InvalidBookingDateError,
  InvalidBookingWindowError,
  InvalidCustomerDataError,
  SlotUnavailableError,
} from "../errors/booking.errors";
import type { BookingRepository } from "../repositories/booking.repository";

/**
 * Input data for creating a booking
 * Extends the entity creation data with validation context
 */
export interface CreateBookingInput extends CreateBookingData {
  requestedAt?: Date; // When the booking request was made
}

/**
 * Result of a successful booking creation
 */
export interface CreateBookingResult {
  bookingId: string;
  booking: Booking;
  message: string;
}

/**
 * Configuration for booking business rules
 * These can be adjusted without changing the use case logic
 */
export interface BookingBusinessRules {
  maxAdvanceBookingDays?: number;
  minBookingHours?: number;
  maxStudentsPerDay?: number;
  allowDuplicateBookings?: boolean;
}

/**
 * Dependencies for the create booking use case
 */
export interface CreateBookingDependencies {
  bookingRepository: BookingRepository;
  businessRules?: BookingBusinessRules;
}

/**
 * CreateBooking Use Case - Functional Implementation
 *
 * Pure function that orchestrates the business process of creating a booking.
 * Takes dependencies as parameters instead of constructor injection.
 *
 * @param dependencies Repository and business rules
 * @param input Booking creation data
 * @returns Promise resolving to booking result
 * @throws BookingDomainError for business rule violations
 */
export async function createBookingUseCase(
  dependencies: CreateBookingDependencies,
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const { bookingRepository, businessRules = {} } = dependencies;

  // Step 1: Validate input data
  await validateBookingData(input);

  // Step 2: Validate business rules
  await validateBusinessRules(bookingRepository, businessRules, input);

  // Step 3: Create and persist the booking
  const booking = createBooking(input);
  const bookingId = await bookingRepository.create(booking);

  // Step 4: Return success result
  const persistedBooking: Booking = { ...booking, id: bookingId };

  return {
    bookingId,
    booking: persistedBooking,
    message: `Booking created successfully for ${input.customerName} on ${input.startDate.toDateString()}`,
  };
}

/**
 * Validate the basic booking data
 */
async function validateBookingData(input: CreateBookingInput): Promise<void> {
  // Required field validation
  if (!input.customerEmail?.trim()) {
    throw new InvalidCustomerDataError(
      "customerEmail",
      input.customerEmail,
      "Email is required"
    );
  }

  if (!input.customerName?.trim()) {
    throw new InvalidCustomerDataError(
      "customerName",
      input.customerName,
      "Name is required"
    );
  }

  if (!input.courseType?.trim()) {
    throw new InvalidCustomerDataError(
      "courseType",
      input.courseType,
      "Course type is required"
    );
  }

  if (!input.numberOfStudents || input.numberOfStudents < 1) {
    throw new InvalidCustomerDataError(
      "numberOfStudents",
      input.numberOfStudents,
      "Number of students must be at least 1"
    );
  }

  // Email format validation (basic)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.customerEmail.trim())) {
    throw new InvalidCustomerDataError(
      "customerEmail",
      input.customerEmail,
      "Invalid email format"
    );
  }

  // Date validation
  if (!input.startDate || !input.endDate) {
    throw new InvalidBookingDateError(
      input.startDate || new Date(),
      input.endDate || new Date(),
      "DATES_IN_PAST"
    );
  }

  // End date must be >= start date
  if (input.endDate < input.startDate) {
    throw new InvalidBookingDateError(
      input.startDate,
      input.endDate,
      "END_BEFORE_START"
    );
  }

  // Dates must be in the future
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Start of today
  if (input.startDate < now) {
    throw new InvalidBookingDateError(
      input.startDate,
      input.endDate,
      "DATES_IN_PAST"
    );
  }
}

/**
 * Validate business rules and constraints
 */
async function validateBusinessRules(
  repository: BookingRepository,
  businessRules: BookingBusinessRules,
  input: CreateBookingInput
): Promise<void> {
  // Rule 1: Check booking window constraints
  await validateBookingWindow(businessRules, input);

  // Rule 2: Check for duplicate bookings
  if (!businessRules.allowDuplicateBookings) {
    await validateNoDuplicateBookings(repository, input);
  }

  // Rule 3: Check capacity limits
  if (businessRules.maxStudentsPerDay) {
    await validateCapacity(repository, businessRules, input);
  }
}

/**
 * Validate booking is within allowed time window
 */
async function validateBookingWindow(
  businessRules: BookingBusinessRules,
  input: CreateBookingInput
): Promise<void> {
  const now = input.requestedAt || new Date();

  // Check maximum advance booking
  if (businessRules.maxAdvanceBookingDays) {
    const maxAdvanceDate = new Date(now);
    maxAdvanceDate.setDate(
      maxAdvanceDate.getDate() + businessRules.maxAdvanceBookingDays
    );

    if (input.startDate > maxAdvanceDate) {
      throw new InvalidBookingWindowError(input.startDate, now, "TOO_EARLY");
    }
  }

  // Check minimum booking time before course
  if (businessRules.minBookingHours) {
    const minBookingTime = new Date(input.startDate);
    minBookingTime.setHours(
      minBookingTime.getHours() - businessRules.minBookingHours
    );

    if (now > minBookingTime) {
      throw new InvalidBookingWindowError(input.startDate, now, "TOO_LATE");
    }
  }
}

/**
 * Check for conflicting bookings for the same customer
 */
async function validateNoDuplicateBookings(
  repository: BookingRepository,
  input: CreateBookingInput
): Promise<void> {
  const existingBookings = await repository.findByCustomerAndDateRange(
    input.customerEmail,
    input.startDate,
    input.endDate
  );

  if (existingBookings.length > 0) {
    const conflictingBooking = existingBookings[0];
    throw new BookingConflictError(
      input.customerEmail,
      { startDate: input.startDate, endDate: input.endDate },
      conflictingBooking.id
    );
  }
}

/**
 * Validate capacity constraints for the requested dates
 */
async function validateCapacity(
  repository: BookingRepository,
  businessRules: BookingBusinessRules,
  input: CreateBookingInput
): Promise<void> {
  // Get all bookings that overlap with requested dates
  const overlappingBookings = await repository.findByDateRange(
    input.startDate,
    input.endDate
  );

  // Calculate total students already booked
  const totalExistingStudents = overlappingBookings
    .filter(
      (booking) =>
        booking.status === "confirmed" || booking.status === "pending"
    )
    .reduce((sum, booking) => sum + booking.numberOfStudents, 0);

  const remainingCapacity =
    businessRules.maxStudentsPerDay! - totalExistingStudents;

  if (input.numberOfStudents > remainingCapacity) {
    throw new SlotUnavailableError(
      input.courseType,
      input.startDate,
      input.numberOfStudents,
      remainingCapacity
    );
  }
}

/**
 * Helper function to create a configured use case function
 * This provides a convenient way to partially apply dependencies
 *
 * @param dependencies Repository and business rules configuration
 * @returns Configured use case function that only needs input
 */
export function createBookingUseCaseFactory(
  dependencies: CreateBookingDependencies
) {
  return (input: CreateBookingInput) =>
    createBookingUseCase(dependencies, input);
}

/**
 * Default business rules for kitesurfing school
 * Can be customized per environment or client needs
 */
export const defaultBookingBusinessRules: BookingBusinessRules = {
  maxAdvanceBookingDays: 90,
  minBookingHours: 24,
  maxStudentsPerDay: 12,
  allowDuplicateBookings: false,
};
