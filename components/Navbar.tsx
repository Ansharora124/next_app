"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import GooeyNav from "@/components/GooeyNav";
import { trackEvent } from "@/lib/posthog-client";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/#events", label: "Events" },
  { href: "/bookings", label: "Bookings" },
  { href: "/events/create", label: "Create" },
];

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const pathname = window.location.pathname;
    const nextActiveIndex = pathname.startsWith("/events/create")
      ? 3
      : pathname.startsWith("/bookings")
        ? 2
      : pathname.startsWith("/events")
        ? 1
        : 0;

    setActiveIndex(nextActiveIndex);
  }, []);

  const handleNavigationClick = async (label: string, href: string) => {
    await trackEvent("navigation_link_clicked", {
      navigation_label: label,
      navigation_href: href,
      navigation_area: "primary_header",
    });
  };

  return (
    <header>
      <nav>
        <Link
          href="/"
          className="logo"
          onClick={() => handleNavigationClick("Logo", "/")}
        >
          <Image src="/icons/logo.png" alt="Logo" width={24} height={24} />
          <p>DevEvents</p>
        </Link>
        <GooeyNav
          items={navigationItems}
          initialActiveIndex={activeIndex}
          particleCount={12}
          particleDistances={[70, 8]}
          particleR={90}
          onItemClick={(item) => handleNavigationClick(item.label, item.href)}
        />
      </nav>
    </header>
  );
};

export default Navbar;
