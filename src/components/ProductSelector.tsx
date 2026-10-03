import { useId, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { SIZES, type Color, type Side, type Size } from "../data/products";
import { cn } from "../lib/cn";

/* Radio groups follow the WAI-ARIA pattern: one tab stop, arrow keys move selection. */
function arrowNav<T>(options: readonly T[], value: T | null, onChange: (v: T) => void, isDisabled?: (v: T) => boolean) {
  return (e: KeyboardEvent<HTMLElement>) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    let i = value === null ? -1 : options.indexOf(value);
    for (let step = 0; step < options.length; step++) {
      i = (i + dir + options.length) % options.length;
      if (!isDisabled?.(options[i])) break;
    }
    onChange(options[i]);
    const group = e.currentTarget.closest('[role="radiogroup"]');
    requestAnimationFrame(() => group?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
  };
}

const COLOR_FILL: Record<Color, string> = {
  black: "bg-[#0b0b0c]",
  white: "bg-[#f3f2ef]",
};

/* ───────── Colour ───────── */

interface ColorSwatchesProps {
  colors: Color[];
  value: Color;
  onChange: (c: Color) => void;
  size?: "sm" | "md";
  label: string;
  showLabels?: boolean;
}

export function ColorSwatches({ colors, value, onChange, size = "md", label, showLabels }: ColorSwatchesProps) {
  const onKeyDown = arrowNav(colors, value, onChange);
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex items-center", showLabels ? "gap-2" : "gap-2.5")}>
      {colors.map((c) => {
        const selected = c === value;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={c}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(c)}
            onKeyDown={onKeyDown}
            className={cn(
              "group/sw relative flex items-center rounded-full transition-colors duration-300",
              showLabels ? "liquid-glass h-11 gap-3 pl-1.5 pr-5" : "p-1",
              showLabels && selected && "bg-white/[0.07]",
            )}
          >
            <span
              className={cn(
                "relative z-10 block rounded-full ring-1 ring-offset-2 ring-offset-black transition-[box-shadow] duration-300",
                size === "sm" ? "h-3 w-3" : "h-8 w-8",
                COLOR_FILL[c],
                c === "black" ? "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]" : "",
                selected ? "ring-white/80" : "ring-transparent group-hover/sw:ring-white/30",
              )}
            />
            {showLabels && (
              <span className={cn("relative z-10 text-[11px] uppercase tracking-[0.2em]", selected ? "text-white" : "text-white/50")}>
                {c}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ───────── Size ───────── */

interface SizeSelectorProps {
  value: Size | null;
  onChange: (s: Size) => void;
  error?: string;
}

export function SizeSelector({ value, onChange, error }: SizeSelectorProps) {
  const errorId = useId();
  const labelId = useId();
  const onKeyDown = arrowNav(SIZES, value, onChange);
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span id={labelId} className="eyebrow">
          Size
        </span>
        {value && <span className="text-[11px] tracking-[0.12em] text-white/50">Selected · {value}</span>}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className="mt-3 grid grid-cols-6 gap-1.5"
      >
        {SIZES.map((s, i) => {
          const selected = s === value;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={selected || (value === null && i === 0) ? 0 : -1}
              onClick={() => onChange(s)}
              onKeyDown={onKeyDown}
              className={cn(
                "relative h-11 rounded-full text-[12px] tracking-[0.08em] transition-colors duration-300",
                selected ? "text-black" : "liquid-glass text-white/75 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              {selected && (
                <motion.span
                  layoutId="size-pill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative z-10">{s}</span>
            </button>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2.5 text-[12px] text-[#ff8a7a]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ───────── Quantity ───────── */

export function QuantityStepper({ value, onChange, max = 10 }: { value: number; onChange: (n: number) => void; max?: number }) {
  const btn =
    "relative z-10 flex h-11 w-11 items-center justify-center rounded-full text-lg text-white/70 transition-colors hover:text-white disabled:opacity-25";
  return (
    <div className="liquid-glass inline-flex items-center rounded-full" role="group" aria-label="Quantity">
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Decrease quantity">
        −
      </button>
      <output className="relative z-10 w-8 text-center text-[14px] tabular-nums text-white" aria-live="polite">
        {value}
      </output>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

/* ───────── Front / back ───────── */

interface SideToggleProps {
  value: Side;
  onChange: (s: Side) => void;
  available: Record<Side, boolean>;
}

export function SideToggle({ value, onChange, available }: SideToggleProps) {
  const sides: Side[] = ["front", "back"];
  const onKeyDown = arrowNav(sides, value, onChange, (s) => !available[s]);
  return (
    <div role="radiogroup" aria-label="View side" className="liquid-glass-strong glass-tint flex rounded-full p-1">
      {sides.map((s) => {
        const selected = s === value;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={!available[s]}
            onClick={() => onChange(s)}
            onKeyDown={onKeyDown}
            className={cn(
              "relative z-10 h-9 min-w-[84px] rounded-full px-4 text-[10px] uppercase tracking-[0.24em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-30",
              selected ? "text-black" : "text-white/70 hover:text-white",
            )}
          >
            {selected && (
              <motion.span
                layoutId="side-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            )}
            <span className="relative">{s}</span>
          </button>
        );
      })}
    </div>
  );
}
