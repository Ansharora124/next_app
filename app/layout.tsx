import type { Metadata } from "next";
import { Schibsted_Grotesk,Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "../components/LightRays"; 
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

<div className="absolute inset-x-0 top-[72px] z-[-1] min-h-[calc(100vh-72px)] overflow-hidden">
  <LightRays
    raysOrigin="top-center-offset"
    raysColor="#f2e6e6"
    raysSpeed={1}
    lightSpread={0.5}
    rayLength={1.4}
    followMouse={true}
    mouseInfluence={0.1}
    noiseAmount={0}
    distortion={0}
    className="custom-rays"
    pulsating={false}
    fadeDistance={1}
    saturation={1}
/>

</div>
  
        <main>{children}</main>
        </body>
    </html>
  );
}
