"use client";

import Image from "next/image";
import { trackEvent } from "@/lib/posthog-client";

const ExploreBtn = () => {
  const handleClick = async () => {
    await trackEvent("explore_events_clicked", {
      cta_location: "homepage_hero",
      destination_section: "featured_events",
    });
  };

  return (
    <a href="#events" className="block w-fit mx-auto">
      <button
        type="button"
        id="explore-btn"
        className="mt-7 mx-auto"
        onClick={handleClick}
      >
        Explore Events
        <Image
          src="/icons/arrow-down.svg"
          alt="Arrow down"
          width={20}
          height={20}
        />
      </button>
    </a>
  );
};

export default ExploreBtn;
