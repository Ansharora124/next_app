"use client";

import EventCard from "@/components/EventCard";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import {
  BookingEvent,
  getBookingsByEmail,
} from "@/lib/actions/booking.action";
import { trackEvent } from "@/lib/posthog-client";
import { useState } from "react";

const BookingsPage = () => {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<BookingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setHasSearched(false);

    const result = await getBookingsByEmail(email);

    if (result.success) {
      setBookings(result.bookings);
      setHasSearched(true);
      await trackEvent("bookings_lookup_completed", {
        email,
        booking_count: result.bookings.length,
      });
    } else {
      setBookings([]);
      setError(result.error);
      await trackEvent("bookings_lookup_failed", {
        email,
        error: result.error,
      });
    }

    setIsLoading(false);
  };

  return (
    <section id="my-bookings">
      <div className="header">
        <h1>My Bookings</h1>
        <p>Enter your email to see every event you have signed up for.</p>
      </div>

      <LiquidGlassCard
        glowIntensity="md"
        shadowIntensity="md"
        blurIntensity="md"
        borderRadius="12px"
        className="bookings-glass"
      >
        <form className="booking-search" onSubmit={handleSubmit}>
          <label htmlFor="booking-email">Email Address</label>
          <div>
            <input
              id="booking-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Finding..." : "Find Bookings"}
            </button>
          </div>
        </form>
      </LiquidGlassCard>

      {error && <p className="booking-message error">{error}</p>}

      {isLoading && (
        <p className="booking-message">Finding your bookings...</p>
      )}

      {!isLoading && hasSearched && bookings.length === 0 && (
        <p className="booking-message">
          No bookings found for this email yet.
        </p>
      )}

      {!isLoading && bookings.length > 0 && (
        <div className="bookings-results">
          <div className="results-heading">
            <h2>Your Events</h2>
            <p>
              Found {bookings.length} booking
              {bookings.length === 1 ? "" : "s"} for {email}.
            </p>
          </div>

          <ul className="events">
            {bookings.map((booking) =>
              booking.event ? (
                <li key={booking.bookingId} className="list-none">
                  <EventCard {...booking.event} />
                </li>
              ) : (
                <li key={booking.bookingId} className="missing-event">
                  This booked event is no longer available.
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </section>
  );
};

export default BookingsPage;
