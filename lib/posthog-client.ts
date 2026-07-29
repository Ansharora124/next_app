"use client";

const DISTINCT_ID_STORAGE_KEY = "posthog_distinct_id";

function createDistinctId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `anon_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

export function getBrowserDistinctId() {
  const existingId = window.localStorage.getItem(DISTINCT_ID_STORAGE_KEY);

  if (existingId) {
    return existingId;
  }

  const distinctId = createDistinctId();
  window.localStorage.setItem(DISTINCT_ID_STORAGE_KEY, distinctId);
  return distinctId;
}

export async function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  try {
    const distinctId = getBrowserDistinctId();

    await fetch("/api/posthog/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        distinctId,
        event,
        properties,
      }),
    });
  } catch (error) {
    console.error("Client event tracking failed:", error);
  }
}
