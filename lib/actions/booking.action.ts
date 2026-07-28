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

export type BookingEvent = {
  bookingId: string;
  bookedAt: string;
  event: {
    title: string;
    slug: string;
    image: string;
    location: string;
    date: string;
    time: string;
    mode: string;
  } | null;
};

type GetBookingsResult =
  | { success: true; bookings: BookingEvent[] }
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

export async function getBookingsByEmail(
  email: string
): Promise<GetBookingsResult> {
  try {
    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return { success: false, error: "Email is required." };
    }

    const bookings = await Booking.find({ email: normalizedEmail })
      .populate("eventId", "title slug image location date time mode")
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      bookings: bookings.map((booking) => {
        const event = booking.eventId as {
          title?: string;
          slug?: string;
          image?: string;
          location?: string;
          date?: string;
          time?: string;
          mode?: string;
        } | null;

        return {
          bookingId: booking._id.toString(),
          bookedAt: booking.createdAt.toISOString(),
          event: event
            ? {
                title: event.title || "",
                slug: event.slug || "",
                image: event.image || "",
                location: event.location || "",
                date: event.date || "",
                time: event.time || "",
                mode: event.mode || "",
              }
            : null,
        };
      }),
    };
  } catch (error) {
    console.error("Booking lookup failed:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Booking lookup failed.",
    };
  }
}
