"use client";

import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/posthog-client";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/", label: "Events" },
  { href: "/", label: "Create" },
];

const Navbar = () => {
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
        <ul>
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => handleNavigationClick(item.label, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
