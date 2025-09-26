import { v4 as uuidv4 } from "uuid";
import { BookingMapper } from "./mappers/booking.mapper";
import {
  GoogleSheetsError,
  type GoogleSheetsClient,
} from "./google-sheet-client";
import type { BookingRepository } from "../../domain/repositories/booking.repository";
import type { Booking } from "../../domain/entities/booking";

/**
 * Google Sheets implementation of the BookingRepository interface
 *
 * This bridges our clean domain model with Google Sheets storage:
 * - Implements the repository contract defined in domain layer
 * - Uses GoogleSheetsClient for low-level API operations
 * - Uses BookingMapper for data transformation
 * - Handles infrastructure concerns (error mapping, data consistency)
 *
 * Following clean architecture principles:
 * - Implements domain interface, doesn't leak implementation details
 * - Converts infrastructure errors to simple exceptions
 * - Maintains data consistency within Google Sheets constraints
 */
export class GoogleSheetsBookingRepository implements BookingRepository {
  private client: GoogleSheetsClient;
  private mapper: BookingMapper;

  constructor(client: GoogleSheetsClient) {
    this.client = client;
    this.mapper = new BookingMapper();
  }

  /**
   * Initialize the repository by setting up sheet headers
   * Call this once during application startup
   */
  async initialize(): Promise<void> {
    try {
      await this.client.initializeSheetHeaders();
    } catch (error) {
      throw new Error(`Failed to initialize booking repository: ${error}`);
    }
  }

  /**
   * Create a new booking record
   * @param booking The booking entity to create (id will be generated if not provided)
   * @returns Promise resolving to the generated booking ID
   */
  async create(booking: Booking): Promise<string> {
    try {
      // Generate ID if not provided
      const bookingWithId: Booking = {
        ...booking,
        id: booking.id || uuidv4(),
      };

      // Convert to spreadsheet format
      const row = this.mapper.toSpreadsheetRow(bookingWithId);

      // Append to Google Sheets
      await this.client.appendRows([row]);

      return bookingWithId.id!;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to create booking: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Find a booking by its unique identifier
   * @param id The booking UUID
   * @returns Promise resolving to booking or null if not found
   */
  async findById(id: string): Promise<Booking | null> {
    try {
      // Get all data and search for the booking
      const rows = await this.client.readAllData();
      const bookings = this.mapper.fromSpreadsheetRows(rows);

      return bookings.find((booking) => booking.id === id) || null;
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to find booking by ID: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Find all bookings within a date range (inclusive)
   * @param startDate Range start date
   * @param endDate Range end date
   * @returns Promise resolving to array of bookings
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    try {
      const rows = await this.client.readAllData();
      const bookings = this.mapper.fromSpreadsheetRows(rows);

      return bookings.filter((booking) => {
        // Check if booking dates overlap with search range
        return this.datesOverlap(
          booking.startDate,
          booking.endDate,
          startDate,
          endDate
        );
      });
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by date range: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Find all bookings for an exact date
   * @param date The exact date to search
   * @returns Promise resolving to array of bookings
   */
  async findByExactDate(date: Date): Promise<Booking[]> {
    try {
      const rows = await this.client.readAllData();
      const bookings = this.mapper.fromSpreadsheetRows(rows);

      return bookings.filter((booking) => {
        // Check if the date falls within the booking's date range
        return date >= booking.startDate && date <= booking.endDate;
      });
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by exact date: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Find all bookings for a specific customer
   * @param email Customer's email address
   * @returns Promise resolving to array of bookings
   */
  async findByCustomerEmail(email: string): Promise<Booking[]> {
    try {
      const rows = await this.client.readAllData();
      const bookings = this.mapper.fromSpreadsheetRows(rows);

      return bookings.filter(
        (booking) => booking.customerEmail.toLowerCase() === email.toLowerCase()
      );
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by customer email: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Find customer's bookings within a specific date range
   * @param email Customer's email address
   * @param startDate Range start date
   * @param endDate Range end date
   * @returns Promise resolving to array of bookings
   */
  async findByCustomerAndDateRange(
    email: string,
    startDate: Date,
    endDate: Date
  ): Promise<Booking[]> {
    try {
      const rows = await this.client.readAllData();
      const bookings = this.mapper.fromSpreadsheetRows(rows);

      return bookings.filter((booking) => {
        const emailMatches =
          booking.customerEmail.toLowerCase() === email.toLowerCase();
        const datesOverlap = this.datesOverlap(
          booking.startDate,
          booking.endDate,
          startDate,
          endDate
        );
        return emailMatches && datesOverlap;
      });
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(
          `Failed to find bookings by customer and date range: ${error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Update an existing booking
   * Note: This is not in the repository interface but useful for infrastructure
   * @param booking Updated booking entity
   */
  async update(booking: Booking): Promise<void> {
    if (!booking.id) {
      throw new Error("Cannot update booking without ID");
    }

    try {
      // Find the row number for this booking
      const rowNumber = await this.client.findRowByBookingId(booking.id);
      if (!rowNumber) {
        throw new Error(`Booking ${booking.id} not found for update`);
      }

      // Convert to spreadsheet format and update
      const row = this.mapper.toSpreadsheetRow(booking);
      await this.client.updateRow(rowNumber, row);
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to update booking: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Helper method to check if two date ranges overlap
   * Used for date-based queries
   */
  private datesOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date
  ): boolean {
    return start1 <= end2 && end1 >= start2;
  }

  /**
   * Get repository statistics (useful for monitoring)
   * @returns Object with repository statistics
   */
  async getStats(): Promise<{
    totalBookings: number;
    activeBookings: number;
    lastUpdated: Date;
  }> {
    try {
      const rows = await this.client.readAllData();
      const bookings = this.mapper.fromSpreadsheetRows(rows);

      const activeBookings = bookings.filter(
        (b) => b.status === "pending" || b.status === "confirmed"
      ).length;

      return {
        totalBookings: bookings.length,
        activeBookings,
        lastUpdated: new Date(),
      };
    } catch (error) {
      if (error instanceof GoogleSheetsError) {
        throw new Error(`Failed to get repository stats: ${error.message}`);
      }
      throw error;
    }
  }
}
