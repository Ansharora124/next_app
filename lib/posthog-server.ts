import { PostHog } from "posthog-node";

const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
const host = process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST;

export const posthogServer =
  projectToken && host
    ? new PostHog(projectToken, {
        host,
        flushAt: 1,
        flushInterval: 0,
        enableExceptionAutocapture: true,
      })
    : null;

export async function captureServerEvent({
  distinctId,
  event,
  properties,
}: {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
}) {
  if (!posthogServer) {
    return;
  }

  posthogServer.capture({
    distinctId,
    event,
    properties,
  });

  await posthogServer.flush();
}
