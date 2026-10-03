import { motion } from "motion/react";
import { formatPrice } from "../data/products";
import { EASE } from "../lib/motion";
import { GlassButton } from "./GlassButton";
import type { OrderLine, OrderReceipt } from "./OrderForm";

interface OrderSuccessProps {
  receipt: OrderReceipt;
  line: OrderLine;
  onClose: () => void;
}

export function OrderSuccess({ receipt, line, onClose }: OrderSuccessProps) {
  const firstName = receipt.name.split(" ")[0];
  const step = (delay: number) => ({
    initial: { opacity: 0, y: 12, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, ease: EASE, delay },
  });

  return (
    <div className="flex min-h-full flex-col" role="status" aria-live="polite">
      <motion.div {...step(0)} className="liquid-glass flex h-14 w-14 items-center justify-center rounded-full">
        <svg viewBox="0 0 24 24" className="relative z-10 h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          />
        </svg>
      </motion.div>

      <motion.p {...step(0.1)} className="eyebrow mt-10">
        Order {receipt.reference}
      </motion.p>
      <motion.h2 {...step(0.18)} className="mt-4 font-serif text-[3rem] leading-[0.95] text-white" data-autofocus tabIndex={-1}>
        Received.
        <br />
        <span className="italic text-white/55">Thank you, {firstName}.</span>
      </motion.h2>

      <motion.p {...step(0.28)} className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">
        Your {line.product.name} tee ({line.color}, {line.size}
        {line.quantity > 1 ? `, ×${line.quantity}` : ""}) is reserved. We'll call you on{" "}
        <span className="whitespace-nowrap text-white">{receipt.phone}</span> to confirm delivery.
      </motion.p>

      <motion.div {...step(0.38)} className="liquid-glass mt-10 rounded-2xl px-5 py-5">
        <div className="relative z-10 flex items-baseline justify-between">
          <span className="text-[11px] uppercase tracking-[0.22em] text-white/50">Cash on delivery</span>
          <span className="font-serif text-3xl text-white">{formatPrice(receipt.total)}</span>
        </div>
        <p className="relative z-10 mt-2 text-[13px] text-white/45">Pay the courier in cash when your order arrives. Nothing has been charged.</p>
      </motion.div>

      <motion.div {...step(0.48)} className="mt-auto pt-10">
        <GlassButton onClick={onClose} size="lg" className="w-full">
          Continue browsing
        </GlassButton>
      </motion.div>
    </div>
  );
}
