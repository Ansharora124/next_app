"use client";

import Link from "next/link";
import Image from "next/image";
import BorderGlow from "@/components/BorderGlow";
import { trackEvent } from "@/lib/posthog-client";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  const handleClick = async () => {
    await trackEvent("event_card_selected", {
      event_slug: slug,
      event_title: title,
      event_location: location,
      event_date: date,
      section: "featured_events",
    });
  };

  return (
    <BorderGlow
      animated
      className="h-full"
      backgroundColor="#0d161a"
      borderRadius={12}
      glowColor="180 75 70"
      glowRadius={34}
      glowIntensity={0.9}
      colors={["#59deca", "#94eaff", "#ffffff"]}
    >
      <Link href={`/events/${slug}`} id="event-card" onClick={handleClick}>
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster"
        />
        <div className="flex flex-row gap-2">
          <Image src="/icons/pin.svg" alt="Location" width={14} height={14} />
          <p>{location}</p>
        </div>

        <p className="title">{title}</p>
        <div>
          <Image src="/icons/calendar.svg" alt="Date" width={14} height={14} />
          <p>{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="Time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </Link>
    </BorderGlow>
  );  
};

export default EventCard;
