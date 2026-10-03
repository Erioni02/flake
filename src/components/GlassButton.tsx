import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from "react";
import { cn } from "../lib/cn";

type Variant = "glass" | "solid" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex select-none items-center justify-center gap-3 rounded-full font-sans tracking-[0.18em] uppercase transition-[background-color,color,opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  glass: "liquid-glass glass-sheen text-white hover:bg-white/[0.06]",
  solid: "bg-white text-black hover:bg-white/85",
  ghost: "text-white/70 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[10px]",
  md: "h-11 px-6 text-[11px]",
  lg: "h-14 px-8 text-[11px]",
};

interface Common {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export const buttonClass = (variant: Variant = "glass", size: Size = "md", className?: string) =>
  cn(base, variants[variant], sizes[size], className);

export const GlassButton = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(
  function GlassButton({ variant, size, className, children, type = "button", ...rest }, ref) {
    return (
      <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest}>
        <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
      </button>
    );
  },
);

export function GlassLink({ variant, size, className, children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
    </a>
  );
}

/** Thin arrow that nudges on hover of its parent `group`. */
export function Arrow({ className, direction = "right" }: { className?: string; direction?: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 12"
      className={cn("h-3 w-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        direction === "right" ? "group-hover:translate-x-1" : "rotate-180 group-hover:-translate-x-1",
        className,
      )}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}
