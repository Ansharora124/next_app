"use client";

import { type HTMLAttributes, type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

type Intensity = "sm" | "md" | "lg";

interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glowIntensity?: Intensity;
  shadowIntensity?: Intensity;
  blurIntensity?: Intensity;
  borderRadius?: string;
  draggable?: boolean;
}

const blurMap: Record<Intensity, string> = {
  sm: "blur(16px) saturate(150%)",
  md: "blur(24px) saturate(165%)",
  lg: "blur(34px) saturate(180%)",
};

const shadowMap: Record<Intensity, string> = {
  sm: "0 18px 52px rgba(0,0,0,0.28)",
  md: "0 24px 80px rgba(0,0,0,0.38)",
  lg: "0 32px 110px rgba(0,0,0,0.48)",
};

const glowMap: Record<Intensity, string> = {
  sm: "0 0 26px rgba(89,222,202,0.12)",
  md: "0 0 42px rgba(89,222,202,0.18)",
  lg: "0 0 64px rgba(89,222,202,0.24)",
};

export function LiquidGlassCard({
  children,
  className,
  glowIntensity = "md",
  shadowIntensity = "md",
  blurIntensity = "md",
  borderRadius = "12px",
  draggable = false,
  onMouseMove,
  onMouseLeave,
  style,
  ...props
}: LiquidGlassCardProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-primary/20 bg-black/[0.12]",
        className
      )}
      style={{
        borderRadius,
        boxShadow: `${shadowMap[shadowIntensity]}, ${glowMap[glowIntensity]}`,
        transform: draggable
          ? `translate3d(${offset.x}px, ${offset.y}px, 0)`
          : undefined,
        transition: draggable ? "transform 0.35s ease-out" : undefined,
        backdropFilter: blurMap[blurIntensity],
        WebkitBackdropFilter: blurMap[blurIntensity],
        ...style,
      }}
      onMouseMove={(event) => {
        if (draggable) {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = (event.clientX - (rect.left + rect.width / 2)) / 42;
          const y = (event.clientY - (rect.top + rect.height / 2)) / 42;
          setOffset({ x, y });
        }

        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        if (draggable) {
          setOffset({ x: 0, y: 0 });
        }

        onMouseLeave?.(event);
      }}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_top_left,rgba(89,222,202,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(148,234,255,0.08),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-px z-[-1] rounded-[inherit] border border-primary/10 shadow-[inset_0_1px_0_rgba(89,222,202,0.16),inset_0_-1px_0_rgba(148,234,255,0.05)]" />
      {children}
    </div>
  );
}
