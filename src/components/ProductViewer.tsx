import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import {
  availableColors,
  formatPrice,
  lookLabel,
  PRICE_EUR,
  type Color,
  type Product,
  type Side,
  type Size,
} from "../data/products";
import { useDialog } from "../hooks/useDialog";
import { cn } from "../lib/cn";
import { EASE } from "../lib/motion";
import { GlassButton } from "./GlassButton";
import { OrderForm, type OrderReceipt } from "./OrderForm";
import { OrderSuccess } from "./OrderSuccess";
import { ColorSwatches, QuantityStepper, SideToggle, SizeSelector } from "./ProductSelector";

interface ProductViewerProps {
  product: Product;
  initialColor: Color;
  onClose: () => void;
}

type Step = "details" | "order" | "success";

const preloaded = new Set<string>();
function preload(src?: string) {
  if (!src || preloaded.has(src)) return;
  preloaded.add(src);
  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

export function ProductViewer({ product, initialColor, onClose }: ProductViewerProps) {
  const colors = availableColors(product);
  const [color, setColor] = useState<Color>(colors.includes(initialColor) ? initialColor : colors[0]);
  const looks = product.looks[color] ?? [];
  const [lookIndex, setLookIndex] = useState(0);
  // The print lives on the back, so that's the first thing you see.
  const [side, setSide] = useState<Side>("back");
  const [size, setSize] = useState<Size | null>(null);
  const [sizeError, setSizeError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<Step>("details");
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [direction, setDirection] = useState(0);

  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  useDialog(dialogRef, true, onClose);

  const look = looks[Math.min(lookIndex, looks.length - 1)];
  const available = { front: !!look?.front, back: !!look?.back };
  const activeSide: Side = available[side] ? side : available.front ? "front" : "back";
  const image = look?.[activeSide];

  // Warm the cache for every shot in the current colour so switching feels instant.
  useEffect(() => {
    looks.forEach((l) => {
      preload(l.front?.src);
      preload(l.back?.src);
    });
  }, [looks]);

  const changeColor = (next: Color) => {
    // Keep the same look (flat / him / her) when it exists in the new colour.
    const kind = look?.kind;
    const nextLooks = product.looks[next] ?? [];
    const i = nextLooks.findIndex((l) => l.kind === kind);
    setColor(next);
    setLookIndex(i >= 0 ? i : 0);
  };

  const goLook = useCallback(
    (delta: number) => {
      if (looks.length < 2) return;
      setDirection(delta);
      setLookIndex((i) => (i + delta + looks.length) % looks.length);
    },
    [looks.length],
  );

  const flip = () => {
    const other: Side = activeSide === "front" ? "back" : "front";
    if (available[other]) {
      setDirection(0);
      setSide(other);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60 || Math.abs(info.velocity.x) > 400) goLook(info.offset.x < 0 ? 1 : -1);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (step !== "details") return;
    const t = e.target as HTMLElement;
    if (t.closest('input, textarea, [role="radiogroup"]')) return;
    if (e.key === "ArrowRight") goLook(1);
    else if (e.key === "ArrowLeft") goLook(-1);
  };

  const startOrder = () => {
    if (!size) {
      setSizeError("Select a size to continue.");
      infoRef.current?.querySelector<HTMLElement>('[role="radiogroup"] [role="radio"][tabindex="0"]')?.focus();
      return;
    }
    goToStep("order");
  };

  const goToStep = (next: Step) => {
    setStep(next);
    // On mobile the whole sheet scrolls; bring the panel top into view.
    requestAnimationFrame(() => {
      const panel = infoRef.current;
      const scroller = scrollRef.current;
      if (!panel || !scroller) return;
      if (window.matchMedia("(min-width: 768px)").matches) panel.scrollTo({ top: 0, behavior: "smooth" });
      else scroller.scrollTo({ top: panel.offsetTop - 8, behavior: "smooth" });
      panel.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
    });
  };

  const thumbnail = useMemo(() => {
    const flat = looks.find((l) => l.kind === "flat");
    return flat?.back ?? flat?.front;
  }, [looks]);

  const titleId = `viewer-${product.id}-title`;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="pointer-events-none fixed inset-0 z-[71] flex md:items-center md:justify-center md:p-6">
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          initial={{ opacity: 0, y: 24, scale: 0.985, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 16, scale: 0.99, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="pointer-events-auto relative h-full w-full bg-black outline-none md:liquid-glass-strong md:h-[min(880px,calc(100svh-48px))] md:max-w-[1240px] md:rounded-[28px] md:bg-black/70"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="liquid-glass-strong glass-tint absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:right-5 md:top-5"
          >
            <svg viewBox="0 0 24 24" className="relative z-10 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="no-scrollbar relative z-10 h-full overflow-y-auto overscroll-contain md:flex md:overflow-hidden"
          >
            {/* ───── Image stage ───── */}
            <div className="relative aspect-[4/5] max-h-[72svh] w-full overflow-hidden bg-black md:aspect-auto md:h-full md:max-h-none md:w-[calc(min(880px,100svh-48px)*0.75)] md:max-w-[56%] md:shrink-0 md:rounded-l-[28px]">
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                {image && (
                  <motion.img
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 40, scale: d ? 1 : 1.02, filter: "blur(10px)" }),
                      center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
                      exit: (d: number) => ({ opacity: 0, x: d * -40, filter: "blur(10px)" }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.55, ease: EASE }}
                    drag={looks.length > 1 ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={onDragEnd}
                    onClick={flip}
                    draggable={false}
                    className={cn(
                      "absolute inset-0 h-full w-full select-none object-cover",
                      available.front && available.back ? "cursor-pointer" : "",
                    )}
                  />
                )}
              </AnimatePresence>

              <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent" />

              {/* Look switcher */}
              <div
                role="tablist"
                aria-label="Photos"
                className="liquid-glass-strong glass-tint absolute left-4 top-4 z-20 flex rounded-full p-1 md:left-5 md:top-5"
              >
                {looks.map((l, i) => {
                  const selected = i === lookIndex;
                  return (
                    <button
                      key={l.kind}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => {
                        setDirection(i > lookIndex ? 1 : -1);
                        setLookIndex(i);
                      }}
                      className={cn(
                        "relative z-10 h-8 rounded-full px-3 text-[10px] uppercase tracking-[0.2em] transition-colors sm:px-3.5",
                        selected ? "text-white" : "text-white/45 hover:text-white/80",
                      )}
                    >
                      {selected && (
                        <motion.span
                          layoutId="look-pill"
                          className="absolute inset-0 rounded-full bg-white/[0.12]"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                      )}
                      <span className="relative">{lookLabel(l.kind)}</span>
                    </button>
                  );
                })}
              </div>

              {looks.length > 1 && (
                <>
                  <StageArrow side="left" onClick={() => goLook(-1)} />
                  <StageArrow side="right" onClick={() => goLook(1)} />
                </>
              )}

              <div className="absolute inset-x-0 bottom-5 z-20 flex flex-col items-center gap-3">
                <SideToggle
                  value={activeSide}
                  onChange={(s) => {
                    setDirection(0);
                    setSide(s);
                  }}
                  available={available}
                />
                {available.front && available.back && (
                  <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/40 md:block">Click the image to turn it</span>
                )}
              </div>
            </div>

            {/* ───── Info panel ───── */}
            <div ref={infoRef} className="relative md:min-w-0 md:flex-1 md:overflow-y-auto md:overscroll-contain">
              <div className="px-5 pb-32 pt-10 sm:px-8 md:min-h-full md:px-10 md:pb-10 md:pt-16 lg:px-14">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="md:min-h-full"
                  >
                    {step === "details" && (
                      <div className="flex flex-col">
                        <p className="eyebrow">
                          {product.number} / 04 — FLAKE
                        </p>
                        <h2 id={titleId} className="mt-4 font-serif text-[clamp(2.75rem,5vw,4rem)] leading-[0.92] text-white">
                          {product.name}
                        </h2>
                        <p className="mt-3 text-[13px] italic text-white/45">“{product.print}”</p>
                        <p className="mt-6 font-serif text-3xl text-white">{formatPrice(PRICE_EUR)}</p>

                        <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">{product.description}</p>

                        <div className="mt-10 space-y-8">
                          <div>
                            <div className="flex items-baseline justify-between">
                              <span className="eyebrow">Colour</span>
                              <span className="text-[11px] capitalize tracking-[0.12em] text-white/50">{color}</span>
                            </div>
                            <div className="mt-3">
                              <ColorSwatches colors={colors} value={color} onChange={changeColor} label="Colour" showLabels />
                            </div>
                          </div>

                          <SizeSelector
                            value={size}
                            onChange={(s) => {
                              setSize(s);
                              setSizeError("");
                            }}
                            error={sizeError}
                          />

                          <div className="flex items-center justify-between">
                            <span className="eyebrow">Quantity</span>
                            <QuantityStepper value={quantity} onChange={setQuantity} />
                          </div>
                        </div>

                        <div className="mt-10 hidden md:block">
                          <OrderButton quantity={quantity} onClick={startOrder} />
                        </div>

                        <ul className="mt-10 space-y-2 text-[13px] text-white/45">
                          {product.details.map((d) => (
                            <li key={d} className="flex gap-3">
                              <span className="mt-[9px] h-px w-3 shrink-0 bg-white/25" aria-hidden="true" />
                              {d}
                            </li>
                          ))}
                          <li className="flex gap-3">
                            <span className="mt-[9px] h-px w-3 shrink-0 bg-white/25" aria-hidden="true" />
                            Cash on delivery — pay when it arrives
                          </li>
                        </ul>
                      </div>
                    )}

                    {step === "order" && size && (
                      <OrderForm
                        line={{ product, color, size, quantity, thumbnail }}
                        onBack={() => goToStep("details")}
                        onSuccess={(r) => {
                          setReceipt(r);
                          goToStep("success");
                        }}
                      />
                    )}

                    {step === "success" && receipt && size && (
                      <OrderSuccess receipt={receipt} line={{ product, color, size, quantity }} onClose={onClose} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Rim drawn above the opaque image stage so the panel edge stays continuous. */}
          <div aria-hidden="true" className="glass-rim pointer-events-none absolute inset-0 z-20 hidden rounded-[28px] md:block" />

          {/* Mobile: the order action stays within thumb reach. */}
          {step === "details" && (
            <div className="pb-safe absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black via-black/90 to-transparent px-4 pt-8 md:hidden">
              <OrderButton quantity={quantity} onClick={startOrder} />
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}

function OrderButton({ quantity, onClick }: { quantity: number; onClick: () => void }) {
  return (
    <GlassButton variant="solid" size="lg" className="w-full justify-between" onClick={onClick}>
      <span>Order — Cash on delivery</span>
      <span className="tabular-nums tracking-[0.1em]">{formatPrice(PRICE_EUR * quantity)}</span>
    </GlassButton>
  );
}

function StageArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={cn(
        "liquid-glass-strong glass-tint absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <svg viewBox="0 0 24 24" className={cn("relative z-10 h-4 w-4", side === "left" && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
