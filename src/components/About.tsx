import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { inView } from "../lib/motion";
import { SectionFade } from "./SectionFade";

/** Hosted on Cloudinary, which also serves the resized phone cut and the still frame. */
const CLOUDINARY = "https://res.cloudinary.com/jzxdwuyw/video/upload";
const VERSION = "v1791064654/videoplayback";
const VIDEO_PHONE = `${CLOUDINARY}/q_auto,w_1280/${VERSION}.mp4`;
const VIDEO_DESKTOP = `${CLOUDINARY}/q_auto,w_1920/${VERSION}.mp4`;
const POSTER = `${CLOUDINARY}/so_5,w_1280,q_auto,f_auto/${VERSION}.jpg`;

/**
 * Ember film behind the About copy. Nothing is downloaded until the section is close to
 * the viewport; phones get a lighter 1280px cut. Reduced-motion visitors see the still.
 */
function BackgroundFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  // preload="none" means nothing downloads until play() is first called near the section.
  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // Pause off-screen to save battery; resume when it comes back.
        if (entry.isIntersecting) video.play().catch(() => {});
        else if (!video.paused) video.pause();
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <img src={POSTER} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        tabIndex={-1}
        disablePictureInPicture
        onPlaying={() => setPlaying(true)}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms]"
        style={{ opacity: playing ? 1 : 0 }}
      >
        <source src={VIDEO_PHONE} type="video/mp4" media="(max-width: 767px)" />
        <source src={VIDEO_DESKTOP} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35)_0%,transparent_45%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  );
}

export function About() {
  return (
    <SectionFade id="about" labelledBy="about-title" className="py-36 sm:py-52" background={<BackgroundFilm />}>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p {...inView()} className="eyebrow">
            About — FLAKE
          </motion.p>
          <motion.h2
            {...inView(0.08)}
            id="about-title"
            className="mt-6 font-serif text-[clamp(2.75rem,6vw,5.25rem)] leading-[0.95] text-white"
          >
            Flake means fire.
            <br />
            <span className="italic text-white/60">We kept it simple.</span>
          </motion.h2>
          <motion.div {...inView(0.16)} className="mx-auto mt-8 max-w-md space-y-4 text-[15px] leading-relaxed text-white/70">
            <p>
              FLAKE is a streetwear label built on one idea: a tee should say something. Each design carries a single line,
              printed big on the back, with only a small mark on the front.
            </p>
            <p>Black or white. One cut. The words do the rest.</p>
          </motion.div>
        </div>
      </div>
    </SectionFade>
  );
}
