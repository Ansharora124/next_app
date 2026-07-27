import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events as featuredEvents } from "@/lib/constants";
import { captureServerEvent } from "@/lib/posthog-server";
import { IEvent } from "@/database";
import { connection } from "next/server";
import { Suspense } from "react";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const HomeContent = async () => {
  await connection();

  const response=await fetch(`${BASE_URL}/api/events`, { cache: "no-store" });
  const {events}=await response.json();

 
  await captureServerEvent({
    distinctId: "homepage_featured_events",
    event: "featured_events_list_viewed",
    properties: {
      event_count: featuredEvents.length,
      page_name: "home",
      section: "featured_events",
    },
  });
 
  return (
    <section id="home">
      <div className="hero-copy">
        <h1>
          The Hub for every dev
          <br /> event u cant miss
        </h1>
        <p>Hackathons,meetups,confrences</p>
      </div>
      <ExploreBtn />
      <div className="mt-20 space-y-7" id="events">
        <h3>Featured Events</h3>
        <ul className="events">
          {events && events.length>0 &&events.map((event:IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const page = () => (
  <Suspense fallback={<p>Loading events...</p>}>
    <HomeContent />
  </Suspense>
);

export default page;
