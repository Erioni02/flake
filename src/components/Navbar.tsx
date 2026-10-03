import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useScrolled } from "../hooks/useScrolled";
import { useDialog } from "../hooks/useDialog";
import { cn } from "../lib/cn";
import { EASE } from "../lib/motion";
import { Logo } from "./Logo";
import { Arrow, GlassLink } from "./GlassButton";

const LINKS = [
  { href: "#collection", label: "Collection" },
  { href: "#about", label: "About" },
  { href: "#order", label: "Order" },
];

export function Navbar() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useDialog(menuRef, open, () => setOpen(false));

  // Close the mobile menu if the viewport grows past the breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex h-14 max-w-[1400px] items-center justify-between rounded-full pl-5 pr-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:pl-6",
          scrolled ? "liquid-glass-strong glass-tint" : "bg-transparent",
        )}
      >
        <a href="#top" className="relative z-10 flex items-center rounded-full" aria-label="FLAKE — back to top">
          <Logo />
        </a>

        <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-[11px] uppercase tracking-[0.24em] text-white/60 transition-colors duration-300 hover:text-white"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="relative z-10 flex items-center gap-2">
          <div className="hidden md:block">
            <GlassLink href="#collection" size="sm">
              Shop <Arrow className="w-4" />
            </GlassLink>
          </div>

          <button
            type="button"
            className="liquid-glass flex h-10 items-center gap-2.5 rounded-full px-4 text-[10px] uppercase tracking-[0.24em] text-white md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative z-10">{open ? "Close" : "Menu"}</span>
            <span className="relative z-10 flex w-3.5 flex-col gap-[3px]" aria-hidden="true">
              <span className={cn("h-px bg-white transition-transform duration-500", open && "translate-y-[2px] rotate-45")} />
              <span className={cn("h-px bg-white transition-transform duration-500", open && "-translate-y-[2px] -rotate-45")} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 -z-10 bg-black/50 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              ref={menuRef}
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              tabIndex={-1}
              className="liquid-glass-strong glass-tint mx-auto mt-2 max-w-[1400px] rounded-[28px] p-6 md:hidden"
              initial={{ opacity: 0, y: -8, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(10px)" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <ul className="relative z-10 flex flex-col">
                {LINKS.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.06 + i * 0.05 }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      {...(i === 0 ? { "data-autofocus": true } : {})}
                      className="flex items-baseline justify-between py-3 font-serif text-[2rem] leading-none text-white"
                    >
                      {l.label}
                      <span className="font-sans text-[10px] tracking-[0.2em] text-white/35">0{i + 1}</span>
                    </a>
                  </motion.li>
                ))}
              </ul>
              <p className="relative z-10 mt-6 text-[11px] uppercase tracking-[0.22em] text-white/40">
                €30 · Cash on delivery
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
