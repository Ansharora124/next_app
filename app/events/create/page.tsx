"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const initialForm = {
  title: "",
  description: "",
  overview: "",
  venue: "",
  location: "",
  date: "",
  time: "",
  mode: "offline",
  audience: "",
  organizer: "",
  tags: "",
  agenda: "",
};

const CreateEventPage = () => {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateField = (
    field: keyof typeof initialForm,
    value: string
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!imageFile) {
      setError("Please upload an event image.");
      setIsSubmitting(false);
      return;
    }

    const requestBody = new FormData();
    requestBody.append("image", imageFile);
    requestBody.append("title", form.title);
    requestBody.append("description", form.description);
    requestBody.append("overview", form.overview);
    requestBody.append("venue", form.venue);
    requestBody.append("location", form.location);
    requestBody.append("date", form.date);
    requestBody.append("time", form.time);
    requestBody.append("mode", form.mode);
    requestBody.append("audience", form.audience);
    requestBody.append("organizer", form.organizer);
    requestBody.append(
      "tags",
      JSON.stringify(
        form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    );
    requestBody.append(
      "agenda",
      JSON.stringify(
        form.agenda
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
      )
    );

    const response = await fetch("/api/events", {
      method: "POST",
      body: requestBody,
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || result.message || "Event creation failed.");
      setIsSubmitting(false);
      return;
    }

    router.push("/#events");
    router.refresh();
  };

  return (
    <section id="create-event">
      <div className="header">
        <h1>Create Event</h1>
        <p>Add a new event for everyone to discover.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              required
            />
          </label>

          <label>
            Event Image
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] ?? null)
              }
              required
            />
          </label>

          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(event) => updateField("date", event.target.value)}
              required
            />
          </label>

          <label>
            Time
            <input
              type="time"
              value={form.time}
              onChange={(event) => updateField("time", event.target.value)}
              required
            />
          </label>

          <label>
            Mode
            <select
              value={form.mode}
              onChange={(event) => updateField("mode", event.target.value)}
              required
            >
              <option value="offline">Offline</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>

          <label>
            Audience
            <input
              value={form.audience}
              onChange={(event) => updateField("audience", event.target.value)}
              placeholder="Developers, founders, students"
              required
            />
          </label>

          <label>
            Venue
            <input
              value={form.venue}
              onChange={(event) => updateField("venue", event.target.value)}
              required
            />
          </label>

          <label>
            Location
            <input
              value={form.location}
              onChange={(event) => updateField("location", event.target.value)}
              required
            />
          </label>

          <label>
            Organizer
            <input
              value={form.organizer}
              onChange={(event) => updateField("organizer", event.target.value)}
              required
            />
          </label>

          <label>
            Tags
            <input
              value={form.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              placeholder="react, ai, startup"
              required
            />
          </label>
        </div>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            required
          />
        </label>

        <label>
          Overview
          <textarea
            value={form.overview}
            onChange={(event) => updateField("overview", event.target.value)}
            required
          />
        </label>

        <label>
          Agenda
          <textarea
            value={form.agenda}
            onChange={(event) => updateField("agenda", event.target.value)}
            placeholder={"Opening keynote\nWorkshop\nNetworking"}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </section>
  );
};

export default CreateEventPage;
