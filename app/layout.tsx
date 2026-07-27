import type { Metadata } from "next";
import { Schibsted_Grotesk,Martian_Mono } from "next/font/google";
import "./globals.css";
import Orb from "../components/Orb"; 
import Navbar from "../components/Navbar"; 


const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Events",
  description: "Discover the latest developer events and conferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${schibstedGrotesk.variable} ${martianMono.variable} min-h-full flex flex-col relative overflow-x-hidden`}>
        <Navbar />  

<div className="fixed inset-x-0 top-[72px] z-[-1] h-[calc(100vh-72px)] overflow-hidden bg-black">
  <Orb
    hue={160}
    hoverIntensity={0.45}
    rotateOnHover={true}
    forceHoverState={false}
    backgroundColor="#000000"
  />

</div>
  
        <main>{children}</main>
        </body>
    </html>
  );
}
