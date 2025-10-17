export enum BookingStatus {
  PENDING = "pending", // Initial state when booking is created
  CONFIRMED = "confirmed", // Booking approved and slot reserved
  CANCELLED = "cancelled", // Booking cancelled by customer or school
  COMPLETED = "completed", // Course finished
}

export enum PaymentStatus {
  UNPAID = "unpaid", // No payment received
  DEPOSIT_PAID = "deposit_paid", // Partial payment (deposit) received
  FULLY_PAID = "fully_paid", // Full payment completed
  REFUNDED = "refunded", // Payment refunded (cancelled bookings)
}

export interface Booking {
  /**
   * Unique booking identifier (UUID)
   * Optional during creation, required after persistence
   */
  id?: string;

  // Customer Information
  /**
   * Customer's email address (unique identifier for customer)
   */
  customerEmail: string;

  /**
   * Customer's full name
   */
  customerName: string;

  /**
   * Customer's phone number (optional but recommended)
   */
  customerPhone?: string;

  // Course Details
  /**
   * Type of kitesurfing course (flexible string for now)
   * Examples: "Beginner Course", "Advanced Lesson", "Private Session"
   */
  courseType: string;

  /**
   * Course start date
   */
  startDate: Date;

  /**
   * Course end date (same as startDate for single-day courses)
   */
  endDate: Date;

  // Booking Management
  /**
   * Current booking status
   */
  status: BookingStatus;

  /**
   * Payment status for this booking
   */
  paymentStatus: PaymentStatus;

  /**
   * When this booking was created
   */
  createdAt: Date;

  /**
   * Optional special requests or notes
   */
  specialRequests?: string;
}

export interface CreateBookingData {
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  courseType: string;
  startDate: Date;
  endDate: Date;
  specialRequests?: string;
}

export function createBookingEntity(data: CreateBookingData): Booking {
  return {
    ...data,
    status: BookingStatus.PENDING,
    paymentStatus: PaymentStatus.UNPAID,
    createdAt: new Date(),
  };
}
