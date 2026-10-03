import { motion } from "motion/react";
import { inView } from "../lib/motion";
import { Logo } from "./Logo";
import { FireText } from "./FireText";

const LINKS = [
  { href: "#collection", label: "Collection" },
  { href: "#about", label: "About" },
  { href: "#order", label: "Order" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black pb-safe pt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="ambient-glow pointer-events-none absolute bottom-[-30%] left-1/2 h-[60vw] w-[90vw] -translate-x-1/2" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/45">
              Graphic tees from FLAKE. Collection 01, delivered with cash on delivery.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex gap-8">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-[11px] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <motion.p
          {...inView()}
          aria-hidden="true"
          className="mt-20 select-none text-center font-serif text-[clamp(5rem,24vw,20rem)] leading-[0.85] tracking-[-0.02em]"
        >
          <FireText>FLAKE</FireText>
        </motion.p>

        <div className="mt-8 flex flex-col gap-2 pb-6 text-[11px] tracking-[0.14em] text-white/35 sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} FLAKE — ZJARR</span>
          <span>Cash on delivery only</span>
        </div>
      </div>
    </footer>
  );
}
