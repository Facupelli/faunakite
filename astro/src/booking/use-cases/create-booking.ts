import { GoogleSheetsBookingRepository } from "../google-sheets/google-sheet-booking.repository";
import {
  createBookingUseCaseFactory,
  type BookingBusinessRules,
} from "./create-booking.use-case";

export const defaultBookingBusinessRules: BookingBusinessRules = {
  maxAdvanceBookingDays: 90,
  minBookingHours: 24,
  maxStudentsPerDay: 12,
  allowDuplicateBookings: false,
};

export const createBooking = createBookingUseCaseFactory({
  bookingRepository: GoogleSheetsBookingRepository,
  businessRules: defaultBookingBusinessRules,
});
