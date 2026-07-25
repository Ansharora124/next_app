import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { events as featuredEvents } from "@/lib/constants";
import { captureServerEvent } from "@/lib/posthog-server";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async () => {
  await captureServerEvent({
    distinctId: "homepage_featured_events",
    event: "featured_events_list_viewed",
    properties: {
      event_count: featuredEvents.length,
      page_name: "home",
      section: "featured_events",
    },
  });

  const response=await fetch(`${BASE_URL}/api/events`);
  const {events}=await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for every dev
        <br /> event u cant miss
      </h1>
      <p className="text-center mt-5">Hackathons,meetups,confrences</p>
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

export default page;
