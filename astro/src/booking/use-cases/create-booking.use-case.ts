import {
  createBookingEntity,
  type Booking,
  type CreateBookingData,
} from "../booking.entity";
import type { BookingRepository } from "../booking.repository";

export interface CreateBookingInput extends CreateBookingData {
  requestedAt?: Date; // When the booking request was made
}

export interface CreateBookingResult {
  bookingId: string;
  booking: Booking;
  message: string;
}

export interface CreateBookingDependencies {
  bookingRepository: BookingRepository;
}

export async function createBookingUseCase(
  dependencies: CreateBookingDependencies,
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const { bookingRepository } = dependencies;

  const booking = createBookingEntity(input);
  const bookingId = await bookingRepository.create(booking);

  const persistedBooking: Booking = { ...booking, id: bookingId };

  return {
    bookingId,
    booking: persistedBooking,
    message: `Booking created successfully for ${input.customerName}`,
  };
}

export function createBookingUseCaseFactory(
  dependencies: CreateBookingDependencies
) {
  return (input: CreateBookingInput) =>
    createBookingUseCase(dependencies, input);
}
