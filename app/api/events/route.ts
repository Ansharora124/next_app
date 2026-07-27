import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";
import { v2 as cloudinary } from "cloudinary";

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

export async function GET() {
    try{
        await connectDB();

        const events=await Event.find().sort({createdAt:-1});
        return NextResponse.json({message:'Events fetched successfully',events},{status:200});

    }catch(e){
        return NextResponse.json({message:'failed to fetch events',error:e},{status:500});
    }
}
