"use server"
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

export type EventCardData = {
    id: string;
    title: string;
    slug: string;
    image: string;
    location: string;
    date: string;
    time: string;
    mode: string;
};

export type EventDetailsData = EventCardData & {
    description: string;
    overview: string;
    venue: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
};

type EventFilters = {
    q?: string;
    mode?: string;
    upcoming?: string;
    location?: string;
    tag?: string;
    startDate?: string;
    endDate?: string;
};

type EventQuery = {
    mode?: string;
    location?: RegExp;
    tags?: RegExp | { $in: RegExp[] };
    date?: {
        $gte?: string;
        $lte?: string;
    };
    $or?: Array<{
        title?: RegExp;
        location?: RegExp;
        organizer?: RegExp;
        tags?: RegExp;
    }>;
};

function escapeRegex(value: string) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeEvent(event: any): EventDetailsData {
    return {
        id: event._id.toString(),
        title: event.title,
        slug: event.slug,
        description: event.description,
        overview: event.overview,
        image: event.image,
        venue: event.venue,
        location: event.location,
        date: event.date,
        time: event.time,
        mode: event.mode,
        audience: event.audience,
        agenda: event.agenda || [],
        organizer: event.organizer,
        tags: event.tags || [],
    };
}

export async function getEvents(filters: EventFilters = {}) {
    try {
        await connectDB();

        const query: EventQuery = {};
        const search = filters.q?.trim();
        const mode = filters.mode?.trim();
        const upcoming = filters.upcoming === "true";
        const location = filters.location?.trim();
        const tag = filters.tag?.trim();
        const startDate = filters.startDate?.trim();
        const endDate = filters.endDate?.trim();

        if (search) {
            const searchRegex = new RegExp(escapeRegex(search), "i");
            query.$or = [
                { title: searchRegex },
                { location: searchRegex },
                { organizer: searchRegex },
                { tags: searchRegex },
            ];
        }

        if (mode && ["online", "offline", "hybrid"].includes(mode)) {
            query.mode = mode;
        }

        if (location) {
            query.location = new RegExp(escapeRegex(location), "i");
        }

        if (tag) {
            const tagRegexes = tag
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
                .map((item) => new RegExp(escapeRegex(item), "i"));

            if (tagRegexes.length > 0) {
                query.tags = { $in: tagRegexes };
            }
        }

        if (upcoming || startDate || endDate) {
            query.date = {};
        }

        if (upcoming) {
            query.date!.$gte = new Date().toISOString().split("T")[0];
        }

        if (startDate) {
            query.date!.$gte = startDate;
        }

        if (endDate) {
            query.date!.$lte = endDate;
        }

        const events = await Event.find(query).sort({ date: 1, createdAt: -1 }).lean();

        return events.map(serializeEvent);
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return [];
    }
}

export async function getEventBySlug(slug: string) {
    try {
        await connectDB();

        const event = await Event.findOne({ slug: slug.trim().toLowerCase() }).lean();

        return event ? serializeEvent(event) : null;
    } catch (error) {
        console.error("Failed to fetch event by slug:", error);
        return null;
    }
}

export const getSimilarEventsBySlug=async(slug:string)=>{
    try{
await connectDB();
const event=await Event.findOne({slug}).lean();
if(!event) return [];

const events = await Event.find({
    _id:{$ne:event._id},
    tags:{$in:event.tags}
}).lean();

return events.map(serializeEvent);
}catch{
        return[];
    }
}
