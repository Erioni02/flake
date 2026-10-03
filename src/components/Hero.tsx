import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE, reveal } from "../lib/motion";
import { Arrow, GlassLink } from "./GlassButton";

/**
 * Same campaign film, three ways: a 720p cut for phones, 1080p for everything else,
 * and the original Dropbox file as a last resort. `raw=1` is the form Dropbox
 * serves as a direct file stream instead of its preview page.
 */
const DROPBOX_VIDEO =
  "https://www.dropbox.com/scl/fi/cwyukg9teaaelnnwib7k8/0818.mp4?rlkey=000lr2j5wkifc9scw685xw5ps&st=ryju41nn&raw=1";

export function Hero({ ready }: { ready: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // Some mobile browsers ignore the autoplay attribute until the element is visible.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduce) return;
    v.muted = true;
    v.play().catch(() => {});
  }, [ready, reduce]);

  return (
    <section id="top" aria-labelledby="hero-title" className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-black">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08, opacity: 0 }}
        animate={ready ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 2.2, ease: EASE }}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
        >
          <source src="/media/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/media/hero-1080.mp4" type="video/mp4" />
          <source src={DROPBOX_VIDEO} type="video/mp4" />
        </video>
      </motion.div>

      {/* Overlays: a light veil and soft edges — the film carries the wordmark itself. */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]" />

      <h1 id="hero-title" className="sr-only">
        FLAKE — Zjarr
      </h1>

      {/* Sits centred just under the FLAKE wordmark in the film. */}
      <motion.div
        variants={reveal}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
        transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
        className="absolute inset-x-0 bottom-[14%] z-10 flex justify-center px-5 sm:bottom-[13%]"
      >
        <GlassLink href="#collection" size="lg">
          Shop the collection <Arrow />
        </GlassLink>
      </motion.div>

      {/* Final fade so the film sinks straight into the collection. */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-8 z-[1] h-20 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.95),transparent_70%)] blur-2xl" />
    </section>
  );
}
