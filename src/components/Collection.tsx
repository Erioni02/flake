import { motion } from "motion/react";
import { PRODUCTS, type Color, type Product } from "../data/products";
import { inView } from "../lib/motion";
import { ProductCard } from "./ProductCard";
import { SectionFade } from "./SectionFade";

interface CollectionProps {
  onOpen: (product: Product, color: Color) => void;
}


export function Collection({ onOpen }: CollectionProps) {
  return (
    <SectionFade id="collection" labelledBy="collection-title" className="pb-32 pt-28 sm:pb-44 sm:pt-36">
      <div className="ambient-glow pointer-events-none absolute -left-[20%] top-[15%] h-[60vw] w-[60vw]" />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <header className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <motion.p {...inView()} className="eyebrow">
              Collection 01 — Four designs
            </motion.p>
            <motion.h2
              {...inView(0.08)}
              id="collection-title"
              className="mt-5 font-serif text-[clamp(3rem,8vw,6.5rem)] leading-[0.9] text-white"
            >
              Said once,
              <br />
              <span className="italic text-white/55">worn loud.</span>
            </motion.h2>
          </div>
          <motion.p
            {...inView(0.16)}
            className="max-w-xs text-[14px] leading-relaxed text-white/55 md:col-span-4 md:col-start-9 md:pb-3"
          >
            Every tee is €30, in black or white, sizes XS to XXL. Tap a piece to see it front and back.
          </motion.p>
        </header>

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-16 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpen={onOpen}
              aspect="aspect-[4/5]"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </SectionFade>
  );
}
