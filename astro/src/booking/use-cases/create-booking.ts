import { GoogleSheetsBookingRepository } from "../google-sheets/google-sheet-booking.repository";
import { createBookingUseCaseFactory } from "./create-booking.use-case";

export const createBooking = createBookingUseCaseFactory({
  bookingRepository: GoogleSheetsBookingRepository,
});
