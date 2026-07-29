import { captureServerEvent } from "@/lib/posthog-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const distinctId =
      typeof body.distinctId === "string" ? body.distinctId : "anonymous";
    const event = typeof body.event === "string" ? body.event : "";
    const properties =
      body.properties && typeof body.properties === "object"
        ? body.properties
        : {};

    if (!event) {
      return NextResponse.json(
        { message: "Event name is required." },
        { status: 400 }
      );
    }

    await captureServerEvent({
      distinctId,
      event,
      properties,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("PostHog tracking failed:", error);

    return NextResponse.json(
      { success: false, message: "Tracking failed." },
      { status: 200 }
    );
  }
}
