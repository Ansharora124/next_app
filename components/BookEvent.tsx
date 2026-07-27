"use client";

import { createBooking } from "@/lib/actions/booking.action";
import { trackEvent } from "@/lib/posthog-client";
import { useState } from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await createBooking({ eventId, slug, email });

    if (result.success) {
      setSubmitted(true);
      await trackEvent("event_booked", { eventId, slug, email });
    } else {
      console.error("Booking creation failed:", result.error);
      await trackEvent("event_booking_failed", {
        eventId,
        slug,
        email,
        error: result.error,
      });
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">
          Thank you for signing up! We will keep you updated.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default BookEvent;
