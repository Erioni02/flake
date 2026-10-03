import type { Transition, Variants } from "motion/react";

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const reveal: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const revealTransition = (delay = 0): Transition => ({
  duration: 0.6,
  ease: EASE,
  delay,
});

/** Props for a scroll-triggered reveal. Spread onto any motion element. */
export const inView = (delay = 0) => ({
  variants: reveal,
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, margin: "0px 0px -12% 0px" },
  transition: revealTransition(delay),
});
