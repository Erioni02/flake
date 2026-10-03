import { motion } from "motion/react";
import { inView } from "../lib/motion";
import { Arrow, GlassLink } from "./GlassButton";
import { SectionFade } from "./SectionFade";

const STEPS = [
  { title: "Choose", body: "Pick a design, a colour and your size." },
  { title: "Confirm", body: "Leave your name, phone and address. No account, no card." },
  { title: "Pay at the door", body: "We call to confirm, then deliver. You pay the courier in cash." },
];

export function OrderInfo() {
  return (
    <SectionFade
      id="order"
      labelledBy="order-title"
      className="py-28 sm:py-40"
      background={
        <div className="pointer-events-none absolute inset-0">
          <img
            src="/campaign/red-flags-night-sm.webp"
            srcSet="/campaign/red-flags-night-sm.webp 560w, /campaign/red-flags-night.webp 1200w"
            sizes="100vw"
            alt=""
            loading="lazy"
            className="absolute right-0 top-0 h-full w-full object-cover object-[50%_40%] opacity-[0.35] [mask-image:radial-gradient(ellipse_60%_60%_at_center,black_30%,transparent_100%)] md:w-1/2"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
      }
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl">
          <motion.p {...inView()} className="eyebrow">
            Ordering
          </motion.p>
          <motion.h2
            {...inView(0.08)}
            id="order-title"
            className="mt-6 font-serif text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.92] text-white"
          >
            Cash on delivery.
            <br />
            <span className="italic text-white/55">Nothing else.</span>
          </motion.h2>
        </div>

        <ol className="mt-16 grid max-w-4xl gap-10 sm:mt-20 sm:grid-cols-3 sm:gap-8">
          {STEPS.map((s, i) => (
            <motion.li key={s.title} {...inView(0.1 + i * 0.08)}>
              <span className="font-serif text-sm italic text-white/40">0{i + 1}</span>
              <h3 className="mt-3 text-[13px] uppercase tracking-[0.22em] text-white">{s.title}</h3>
              <p className="mt-3 max-w-[16rem] text-[14px] leading-relaxed text-white/55">{s.body}</p>
            </motion.li>
          ))}
        </ol>

        <motion.div {...inView(0.3)} className="mt-16 flex flex-wrap items-center gap-6">
          <GlassLink href="#collection" size="lg">
            Choose your piece <Arrow />
          </GlassLink>
          <span className="text-[12px] tracking-[0.12em] text-white/40">Every tee €30</span>
        </motion.div>
      </div>
    </SectionFade>
  );
}
