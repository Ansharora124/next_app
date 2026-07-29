import ExploreBtn from "@/components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { events as featuredEvents } from "@/lib/constants";
import { captureServerEvent } from "@/lib/posthog-server";
import { EventCardData, getEvents } from "@/lib/actions/event.actions";
import { connection } from "next/server";
import { Suspense } from "react";

type EventFilters = {
  q?: string;
  mode?: string;
  upcoming?: string;
  location?: string;
  tag?: string;
  startDate?: string;
  endDate?: string;
};

const getFilterValue = (
  value: string | string[] | undefined
) => Array.isArray(value) ? value[0] : value || "";

const HomeContent = async ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  await connection();
  const params = await searchParams;
  const filters = {
    q: getFilterValue(params?.q),
    mode: getFilterValue(params?.mode),
    upcoming: getFilterValue(params?.upcoming),
    location: getFilterValue(params?.location),
    tag: getFilterValue(params?.tag),
    startDate: getFilterValue(params?.startDate),
    endDate: getFilterValue(params?.endDate),
  };

  const events = await getEvents(filters);

 
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
        <LiquidGlassCard
          glowIntensity="sm"
          shadowIntensity="md"
          borderRadius="12px"
          blurIntensity="md"
          className="events-toolbar"
        >
          <div className="events-heading">
            <span>Explore</span>
            <h3>Featured Events</h3>
            <p>Find events by title, location, tags, organizer, mode, or date.</p>
          </div>

          <form className="event-filters">
            <label className="search-field">
              <span>Search</span>
              <input
                type="search"
                name="q"
                defaultValue={filters.q}
                placeholder="React meetup, Bangalore, AI"
              />
            </label>

            <label>
              <span>Mode</span>
              <select name="mode" defaultValue={filters.mode}>
                <option value="">All modes</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </label>

            <label>
              <span>Location</span>
              <input
                name="location"
                defaultValue={filters.location}
                placeholder="Delhi, Mumbai, Remote"
              />
            </label>

            <label>
              <span>Tags</span>
              <input
                name="tag"
                defaultValue={filters.tag}
                placeholder="react, ai"
              />
            </label>

            <label>
              <span>From</span>
              <input
                type="date"
                name="startDate"
                defaultValue={filters.startDate}
              />
            </label>

            <label>
              <span>To</span>
              <input
                type="date"
                name="endDate"
                defaultValue={filters.endDate}
              />
            </label>

            <label className="upcoming-filter">
              <input
                type="checkbox"
                name="upcoming"
                value="true"
                defaultChecked={filters.upcoming === "true"}
              />
              <span>Upcoming only</span>
            </label>

            <div className="filter-actions">
              <button type="submit">Apply</button>
              <a href="/#events">Reset</a>
            </div>
          </form>
        </LiquidGlassCard>

        {events && events.length > 0 ? (
          <ul className="events">
            {events.map((event: EventCardData) => (
              <li key={event.id} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-events">No events matched your filters.</p>
        )}
      </div>
    </section>
  );
};

const page = ({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) => {
  return (
  <Suspense fallback={<p>Loading events...</p>}>
    <HomeContent searchParams={searchParams} />
  </Suspense>
  );
};

export default page;
