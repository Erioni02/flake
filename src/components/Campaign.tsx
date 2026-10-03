import { useRef } from "react";
import { motion } from "motion/react";
import { inView } from "../lib/motion";
import { SectionFade } from "./SectionFade";

interface Shot {
  file: string;
  piece: string;
  alt: string;
}

const SHOTS: Shot[] = [
  { file: "money-talks-night", piece: "Money Talks", alt: "Man from behind in the white Money Talks tee beside a black car at night" },
  { file: "red-flags-jet", piece: "Red Flags", alt: "Man in the black Red Flags tee walking toward a private jet at dusk" },
  { file: "garage", piece: "Hasta La Vista", alt: "Woman in the black FLAKE tee standing in front of a car in an underground garage" },
  { file: "statues", piece: "Red Flags", alt: "Woman in the black FLAKE script tee sitting on a black BMW under marble statues" },
  { file: "hasta-la-vista-street", piece: "Hasta La Vista", alt: "Man from behind in the white Hasta La Vista tee on a city street at night" },
  { file: "i-dont-care-pool", piece: "I Don't Care", alt: "White I Don't Care tee floating in a swimming pool" },
  { file: "money-talks-lake", piece: "Money Talks", alt: "Man in the white Money Talks tee with a suitcase facing a mountain lake" },
  { file: "money-talks-hood", piece: "Money Talks", alt: "White Money Talks tee laid on the hood of a dark car" },
];

export function Campaign() {
  const trackRef = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector("li");
    const step = item ? item.getBoundingClientRect().width + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <SectionFade id="campaign" labelledBy="campaign-title" className="py-24 sm:py-32">
      <div className="mx-auto flex max-w-[1400px] items-end justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <div>
          <motion.p {...inView()} className="eyebrow">
            Campaign 01
          </motion.p>
          <motion.h2
            {...inView(0.08)}
            id="campaign-title"
            className="mt-5 font-serif text-[clamp(2.75rem,6vw,5rem)] leading-[0.92] text-white"
          >
            Out <span className="italic text-white/55">there.</span>
          </motion.h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scroll(dir)}
              aria-label={dir < 0 ? "Previous photos" : "Next photos"}
              className="liquid-glass flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <svg viewBox="0 0 24 24" className={`relative z-10 h-4 w-4 ${dir < 0 ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <motion.ul
        {...inView(0.12)}
        ref={trackRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-4 sm:mt-16 sm:px-8 lg:px-[max(3rem,calc((100vw-1400px)/2+3rem))]"
        aria-label="Campaign photos"
      >
        {SHOTS.map((shot) => (
          <li key={shot.file} className="group w-[78vw] shrink-0 snap-start sm:w-[42vw] lg:w-[30vw] xl:w-[24vw]">
            <figure>
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-950">
                <img
                  src={`/campaign/${shot.file}-sm.webp`}
                  srcSet={`/campaign/${shot.file}-sm.webp 560w, /campaign/${shot.file}.webp 1200w`}
                  sizes="(min-width: 1280px) 24vw, (min-width: 1024px) 30vw, (min-width: 640px) 42vw, 78vw"
                  alt={shot.alt}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover brightness-[0.9] transition-[transform,filter] duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.025] group-hover:brightness-100"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />
              </div>
              <figcaption className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/45">{shot.piece}</figcaption>
            </figure>
          </li>
        ))}
      </motion.ul>
    </SectionFade>
  );
}
