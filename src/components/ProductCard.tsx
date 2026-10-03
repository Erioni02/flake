import { useState } from "react";
import { motion } from "motion/react";
import { availableColors, coverImages, formatPrice, PRICE_EUR, type Color, type Product } from "../data/products";
import { cn } from "../lib/cn";
import { inView } from "../lib/motion";
import { ColorSwatches } from "./ProductSelector";

interface ProductCardProps {
  product: Product;
  onOpen: (product: Product, color: Color) => void;
  /** Tailwind aspect class — lets the collection vary image proportions. */
  aspect?: string;
  className?: string;
  delay?: number;
  sizes: string;
}

/**
 * Editorial product tile: the tee floats on black (the flat shots are photographed
 * on black), the back print shows first, and the front fades in on hover.
 */
export function ProductCard({ product, onOpen, aspect = "aspect-[5/7]", className, delay = 0, sizes }: ProductCardProps) {
  const colors = availableColors(product);
  const [color, setColor] = useState<Color>(colors[0]);
  const { primary, secondary } = coverImages(product, color);
  const titleId = `product-${product.id}-title`;

  return (
    <motion.article {...inView(delay)} className={cn("group/card relative", className)} aria-labelledby={titleId}>
      <button
        type="button"
        onClick={() => onOpen(product, color)}
        className="relative block w-full overflow-hidden rounded-[2px] text-left focus-visible:outline-offset-8"
        aria-label={`View ${product.name} — ${color}`}
      >
        <div className={cn("relative w-full overflow-hidden bg-black [mask-image:radial-gradient(ellipse_at_center,black_66%,transparent_100%)]", aspect)}>
          {/* Ambient glow behind the garment — only visible on the black tee. */}
          <div className="ambient-glow pointer-events-none absolute inset-[10%] opacity-0 transition-opacity duration-1000 group-hover/card:opacity-100" />

          {primary && (
            <img
              key={primary.src}
              src={primary.srcSmall}
              srcSet={`${primary.srcSmall} 640w, ${primary.src} 1400w`}
              sizes={sizes}
              alt={primary.alt}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.025] group-hover/card:opacity-0 group-hover/card:blur-[2px]"
            />
          )}
          {secondary && (
            <img
              key={secondary.src}
              src={secondary.srcSmall}
              srcSet={`${secondary.srcSmall} 640w, ${secondary.src} 1400w`}
              sizes={sizes}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full scale-[1.025] object-cover opacity-0 blur-[2px] transition-[opacity,transform,filter] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-100 group-hover/card:opacity-100 group-hover/card:blur-0"
            />
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent" />

          <span className="absolute left-0 top-0 p-4 font-serif text-sm italic text-white/45 sm:p-5">{product.number}</span>

          <span className="liquid-glass absolute bottom-4 right-4 flex h-9 items-center rounded-full px-4 text-[10px] uppercase tracking-[0.22em] text-white transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:bottom-5 sm:right-5 [@media(hover:hover)]:translate-y-2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:translate-y-0 [@media(hover:hover)]:group-hover/card:opacity-100">
            <span className="relative z-10">View</span>
          </span>
        </div>
      </button>

      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h3 id={titleId} className="font-serif text-[1.75rem] leading-none text-white">
            {product.name}
          </h3>
          <p className="mt-2 truncate text-[12px] italic text-white/40">“{product.print}”</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 pt-1">
          <span className="text-[13px] tracking-[0.08em] text-white/80">{formatPrice(PRICE_EUR)}</span>
          {colors.length > 1 && (
            <ColorSwatches
              colors={colors}
              value={color}
              onChange={setColor}
              size="sm"
              label={`${product.name} colour`}
            />
          )}
        </div>
      </div>
    </motion.article>
  );
}
