import { notFound } from "next/navigation";
import { IEvent } from "@/database";
import { connection } from "next/server";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
import { Suspense } from "react";


const EventDetailItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex gap-2 items-center">
  <Image src={icon} alt={alt} width={17} height={17} />
  <p>{label}</p>
  </div>
);
const EventAgenda=({agendaItems}:{agendaItems:string[]})=>(
<div className="agenda">
  <h2>Event Agenda</h2>
  <ul>
    {agendaItems.map((item)=>(
    <li key={item}>{item}</li>
      
  

    ))}
  </ul>

</div>
)

const EventTags=({tags}:{tags:string[]})=>(
  <div className="flex-row gap-1.5 flex-wrap">
    {tags.map((tag)=>(
      <div key={tag} className="pill">{tag}</div>
    ))} 


  </div>

)
const EventDetailsContent = async ({ params }: {params:Promise<{slug:string}>}) => {
  await connection();
  
  const { slug } = await params;

  const request=await fetch(`${BASE_URL}/api/events/${slug}`);
// CHANGED: keep event object so BookEvent can use event._id and event.slug
const { event } = await request.json();

if (!event) return notFound();

const {
  description,
  image,
  overview,
  location,
  date,
  time,
  mode,
  agenda,
  organizer,
  tags,
} = event;

 


  if(!description) return notFound();
  const bookings=10;
  const similarEvents :IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
 <div className="header">
<h1>Event Description</h1>
<p>{description} </p>

 </div>

 <div className="details">

<div className="content">
<Image src={image} alt="Event Banner" width={800} height={800} className="banner" />
<section className="flex-col-gap-2">
  <h2>Event Overview</h2>
   <p>{overview}</p>
   </section>
   <section className="flex-col-gap-2">
  <h2>Event Details</h2>
  <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
  <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
  <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
  <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode}/>
   
  
</section>
<EventAgenda agendaItems={agenda}/>
<section className="flex-col-gap-2">
  <h2>About Organizer</h2>
  <p>{organizer}</p>

</section>
<EventTags tags={tags} />
</div>


 <aside className="booking">
  <div className="signup-card">
    <h2>Sign Up for the Event</h2>
     {bookings>0 ? (
<p className="text-sm">
  Join {bookings} people have already signed up for this event. Don&apos;t miss out!
</p>
    ):(
<p className="text-sm">
  Be the first to sign up for this event and secure your spot!
</p>
    )}
<BookEvent eventId={event._id.toString()} slug={event.slug}/>

  </div>
 
  </aside> 




 </div>
 <div className="flex w-full flex-col gap-4 pt-20">
  <h2>Similar Events</h2>
  <div className="events">
    {similarEvents.length>0 ? (
      similarEvents.map((similarEvent:IEvent)=>(
        <EventCard key={similarEvent._id.toString()} {...similarEvent}/>
      ))
    ) : (
      <p>No similar events found.</p>
    )}
  </div>

 </div>


    </section>
  )
}

const EventDetailsPage = ({ params }: {params:Promise<{slug:string}>}) => (
  <Suspense fallback={<p>Loading event...</p>}>
    <EventDetailsContent params={params} />
  </Suspense>
);

export default EventDetailsPage
