import type { Booking } from "./booking.entity";

export interface BookingRepository {
  create(booking: Booking): Promise<string>;
  findById(id: string): Promise<Booking | null>;
}
