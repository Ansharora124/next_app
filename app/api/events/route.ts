import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

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

export async function POST(req: NextRequest) {
    try{
        await connectDB();

        const contentType = req.headers.get("content-type") || "";
        let event;

        if (contentType.includes("application/json")) {
            event = await req.json();
        } else {
            const formData=await req.formData();
            event=Object.fromEntries(formData.entries());

            const file=formData.get('image') as File | null;
            if(file && file.size > 0) {
                const arrayBuffer=await file.arrayBuffer();
                const buffer=Buffer.from(arrayBuffer);

                const uploadResult=await new Promise((resolve,reject)=>{
                    cloudinary.uploader.upload_stream({resource_type:'image',folder:'DevEvent'},(error,result)=>{
                        if(error) return reject(error);
                        resolve(result);
                    }).end(buffer);
                });

                event.image=(uploadResult as {secure_url: string}).secure_url;
            }
        }

        const tags = Array.isArray(event.tags)
            ? event.tags
            : JSON.parse(event.tags || "[]");
        const agenda = Array.isArray(event.agenda)
            ? event.agenda
            : JSON.parse(event.agenda || "[]");

        const createdEvent=await Event.create({
            ...event,
            image: event.image || event.imageUrl,
            tags,
            agenda,
        });

return NextResponse.json({message:'Event created successfully',event:createdEvent },{status:201});

    }catch(e){
        console.error(e);
        return NextResponse.json({ message: "Event creation failed",error:e  instanceof Error ? e.message : 'Unknown'}, { status: 500 });

    }
}

export async function GET(req: NextRequest) {
    try{
        await connectDB();

        const searchParams = req.nextUrl.searchParams;
        const query: EventQuery = {};
        const search = searchParams.get("q")?.trim();
        const mode = searchParams.get("mode")?.trim();
        const upcoming = searchParams.get("upcoming") === "true";
        const location = searchParams.get("location")?.trim();
        const tag = searchParams.get("tag")?.trim();
        const startDate = searchParams.get("startDate")?.trim();
        const endDate = searchParams.get("endDate")?.trim();

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

        const events=await Event.find(query).sort({date:1,createdAt:-1});
        return NextResponse.json({message:'Events fetched successfully',events},{status:200});

    }catch(e){
        return NextResponse.json({message:'failed to fetch events',error:e},{status:500});
    }
}
