import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "../lib/motion";

interface LoadingScreenProps {
  onDone: () => void;
}

const LETTERS = "FLAKE".split("");

/**
 * Brand intro. The flame resolves out of a blur, the wordmark settles letter by
 * letter, then the whole layer lifts away into the hero. About two seconds.
 */
export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const minDuration = reduce ? 500 : 1800;
    const start = performance.now();
    let cancelled = false;

    // Wait for the fonts (capped) so the wordmark never swaps mid-intro.
    const fontsReady = Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 1500)),
    ]);

    fontsReady.then(() => {
      const remaining = Math.max(0, minDuration - (performance.now() - start));
      setTimeout(() => !cancelled && onDone(), remaining);
    });
    return () => {
      cancelled = true;
    };
  }, [onDone, reduce]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Loading FLAKE"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: "none", transition: { duration: 0.9, ease: EASE, delay: 0.25 } }}
    >
      <div className="ambient-glow pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        className="relative flex flex-col items-center"
        exit={{ opacity: 0, y: -12, filter: "blur(12px)", scale: 1.02, transition: { duration: 0.7, ease: EASE } }}
      >
        <motion.img
          src="/fire.png"
          alt=""
          width={72}
          height={72}
          className="h-14 w-14 object-contain sm:h-[72px] sm:w-[72px]"
          initial={reduce ? false : { opacity: 0, scale: 0.86, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, ease: EASE }}
        />

        <h1 className="mt-8 flex font-serif text-[3.25rem] leading-none tracking-[0.06em] text-white sm:text-7xl" aria-label="FLAKE">
          {LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, y: 10, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.35 + i * 0.07 }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="mt-5 flex items-center gap-4"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.95 }}
        >
          <span className="h-px w-8 bg-white/25" />
          <span className="eyebrow !text-white/60">Zjarr</span>
          <span className="h-px w-8 bg-white/25" />
        </motion.div>

        {/* A hairline that draws across — progress without a spinner. */}
        <div className="mt-14 h-px w-28 overflow-hidden bg-white/10">
          <motion.div
            className="h-full w-full origin-left bg-white/70"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduce ? 0.4 : 1.7, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
