import type { ReactNode } from "react";
import { cn } from "../lib/cn";

interface SectionFadeProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Extra soft shadow below the section so it sinks into the next one. */
  deepShadow?: boolean;
  /** Set false when the section starts with its own media overlay (e.g. the hero). */
  fadeTop?: boolean;
  fadeBottom?: boolean;
  background?: ReactNode;
  labelledBy?: string;
}

/**
 * Every major section is wrapped in this. There are no borders between sections;
 * each one dissolves into black at the top and bottom instead.
 */
export function SectionFade({
  id,
  children,
  className,
  deepShadow = true,
  fadeTop = true,
  fadeBottom = true,
  background,
  labelledBy,
}: SectionFadeProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative overflow-hidden bg-black", className)}>
      {background}
      {fadeTop && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-32 bg-gradient-to-b from-black to-transparent" />
      )}
      {fadeBottom && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-black to-transparent" />
      )}
      {deepShadow && (
        <div className="pointer-events-none absolute inset-x-0 -bottom-8 z-[1] h-20 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95),transparent_70%)] blur-2xl" />
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
