import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

function isValidSlug(slug: string): boolean {
  // Allow lowercase letters, numbers, and hyphens only.
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    await connectDB();

    const { slug } = await context.params;
    const normalizedSlug = slug.trim().toLowerCase();

    if (!normalizedSlug) {
      return NextResponse.json(
        { message: "Slug is required." },
        { status: 400 }
      );
    }

    if (!isValidSlug(normalizedSlug)) {
      return NextResponse.json(
        {
          message:
            "Invalid slug format. Use lowercase letters, numbers, and hyphens only.",
        },
        { status: 400 }
      );
    }

    const event = await Event.findOne({ slug: normalizedSlug }).lean().exec();

    if (!event) {
      return NextResponse.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully.", event },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch event by slug:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch event.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
