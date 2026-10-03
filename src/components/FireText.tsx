import { useId } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "../lib/cn";

/**
 * Display text that burns: a heat gradient (white-hot at the base, fading to dark red
 * at the tips), a turbulence filter that makes the letterforms waver like flame, and a
 * soft flickering glow behind. Static when the visitor prefers reduced motion.
 */
export function FireText({ children, className }: { children: string; className?: string }) {
  const reduce = useReducedMotion();
  const filterId = `fire-${useId().replace(/:/g, "")}`;

  return (
    <span className={cn("relative inline-block", className)}>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="7" result="noise">
            {!reduce && (
              <animate
                attributeName="baseFrequency"
                dur="6s"
                values="0.008 0.03;0.011 0.042;0.007 0.026;0.008 0.03"
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {/* Glow */}
      <span
        aria-hidden="true"
        className={cn("fire-fill pointer-events-none absolute inset-0 select-none opacity-70 blur-2xl", !reduce && "animate-[fire-flicker_3.2s_ease-in-out_infinite]")}
      >
        {children}
      </span>

      {/* Flames */}
      <span
        className={cn("fire-fill relative block", !reduce && "animate-[fire-rise_4s_ease-in-out_infinite]")}
        style={{ filter: `url(#${filterId})` }}
      >
        {children}
      </span>
    </span>
  );
}
