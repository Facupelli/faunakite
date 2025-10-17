import type { Booking } from "./booking.entity";

export interface BookingRepository {
  /**
   * Creates a new booking record
   * @param booking The booking entity to create
   * @returns Promise resolving to the generated booking ID (UUID)
   * @throws Only infrastructure errors (network, storage failures)
   */
  create(booking: Booking): Promise<string>;

  /**
   * Finds a booking by its unique identifier
   * @param id The booking UUID
   * @returns Promise resolving to booking or null if not found
   */
  findById(id: string): Promise<Booking | null>;

  /**
   * Finds all bookings within a date range (inclusive)
   * Useful for multi-day courses and availability checking
   * @param startDate Range start date
   * @param endDate Range end date
   * @returns Promise resolving to array of bookings (empty if none found)
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]>;

  /**
   * Finds all bookings for an exact date
   * Useful for single-day courses and capacity checking
   * @param date The exact date to search
   * @returns Promise resolving to array of bookings (empty if none found)
   */
  findByExactDate(date: Date): Promise<Booking[]>;

  /**
   * Finds all bookings for a specific customer
   * @param email Customer's email address (unique identifier)
   * @returns Promise resolving to array of bookings (empty if none found)
   */
  findByCustomerEmail(email: string): Promise<Booking[]>;

  /**
   * Finds customer's bookings within a specific date range
   * Useful for duplicate booking prevention and customer history
   * @param email Customer's email address
   * @param startDate Range start date
   * @param endDate Range end date
   * @returns Promise resolving to array of bookings (empty if none found)
   */
  findByCustomerAndDateRange(
    email: string,
    startDate: Date,
    endDate: Date
  ): Promise<Booking[]>;
}
