import type { Booking } from "../booking.entity";
import type { BookingRepository } from "../booking.repository";
import { GoogleSheetsBookingRepository } from "../google-sheets/google-sheet-booking.repository";

interface CreateBookingDependencies {
  bookingRepository: BookingRepository;
}

export async function getBookingByIdUseCase(
  dependencies: CreateBookingDependencies,
  bookingId: string
): Promise<Booking | null> {
  const { bookingRepository } = dependencies;

  const booking = await bookingRepository.findById(bookingId);
  return booking;
}

function getBookingUseCaseFactory(dependencies: CreateBookingDependencies) {
  return (bookingId: string) => getBookingByIdUseCase(dependencies, bookingId);
}

export const getBookingById = getBookingUseCaseFactory({
  bookingRepository: GoogleSheetsBookingRepository,
});
