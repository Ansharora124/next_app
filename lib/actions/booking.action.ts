"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

type CreateBookingParams = {
  eventId: string;
  slug: string;
  email: string;
};

type CreateBookingResult =
  | { success: true }
  | { success: false; error: string };

export async function createBooking({
  eventId,
  email,
}: CreateBookingParams): Promise<CreateBookingResult> {
  try {
    await connectDB();

    await Booking.create({
      eventId,
      email,
    });

    return { success: true };
  } catch (error) {
    console.error("Booking creation failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Booking creation failed.",
    };
  }
}