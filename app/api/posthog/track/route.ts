import { NextResponse } from "next/server";
import { captureServerEvent, posthogServer } from "@/lib/posthog-server";

export async function POST(request: Request) {
  try {
    const { distinctId, event, properties } = await request.json();

    if (!distinctId || !event) {
      return NextResponse.json(
        { error: "distinctId and event are required." },
        { status: 400 }
      );
    }

    await captureServerEvent({
      distinctId,
      event,
      properties,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const fallbackDistinctId = "anonymous_server_error";

    if (posthogServer) {
      posthogServer.captureException(error, fallbackDistinctId, {
        endpoint: "/api/posthog/track",
        route_type: "api",
      });
      await posthogServer.flush();
    }

    return NextResponse.json(
      { error: "Unable to track event." },
      { status: 500 }
    );
  }
}
