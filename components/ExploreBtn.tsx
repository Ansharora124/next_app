"use client";

import Image from "next/image";
import Magnet from "@/components/Magnet";
import { trackEvent } from "@/lib/posthog-client";

const ExploreBtn = () => {
  const handleClick = async () => {
    await trackEvent("explore_events_clicked", {
      cta_location: "homepage_hero",
      destination_section: "featured_events",
    });
  };

  return (
    <Magnet
      padding={70}
      magnetStrength={5}
      wrapperClassName="mx-auto mt-7 block w-fit"
    >
      <a href="#events" className="block w-fit">
        <button type="button" id="explore-btn" onClick={handleClick}>
          Explore Events
          <Image
            src="/icons/arrow-down.svg"
            alt="Arrow down"
            width={20}
            height={20}
          />
        </button>
      </a>
    </Magnet>
  );
};

export default ExploreBtn;
