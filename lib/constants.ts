export type EventItem = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    title: "Next.js Conf 2026",
    image: "/images/event1.png",
    slug: "nextjs-conf-2026",
    location: "San Francisco, CA",
    date: "September 18, 2026",
    time: "9:00 AM - 5:30 PM",
  },
  {
    title: "React Summit Global",
    image: "/images/event2.png",
    slug: "react-summit-global",
    location: "Amsterdam, Netherlands",
    date: "October 7, 2026",
    time: "10:00 AM - 6:00 PM",
  },
  {
    title: "Cloud Native Hackathon",
    image: "/images/event3.png",
    slug: "cloud-native-hackathon",
    location: "Austin, TX",
    date: "November 14, 2026",
    time: "8:30 AM - 8:00 PM",
  },
  {
    title: "DevTools Meetup Night",
    image: "/images/event4.png",
    slug: "devtools-meetup-night",
    location: "London, UK",
    date: "August 22, 2026",
    time: "6:30 PM - 9:00 PM",
  },
  {
    title: "AI Builders Conference",
    image: "/images/event5.png",
    slug: "ai-builders-conference",
    location: "Berlin, Germany",
    date: "December 3, 2026",
    time: "9:30 AM - 5:00 PM",
  },
  {
    title: "Frontend Hack Weekend",
    image: "/images/event6.png",
    slug: "frontend-hack-weekend",
    location: "Toronto, Canada",
    date: "October 24, 2026",
    time: "All day",
  },
];