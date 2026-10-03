import { useEffect, useId, useRef, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatPrice, PRICE_EUR, type Color, type Product, type ProductImage, type Size } from "../data/products";
import { submitToWeb3Forms, SubmitError } from "../lib/web3forms";
import { cn } from "../lib/cn";
import { EASE } from "../lib/motion";
import { Arrow, GlassButton } from "./GlassButton";

export interface OrderLine {
  product: Product;
  color: Color;
  size: Size;
  quantity: number;
  thumbnail?: ProductImage;
}

export interface OrderReceipt {
  reference: string;
  name: string;
  phone: string;
  total: number;
}

interface OrderFormProps {
  line: OrderLine;
  onBack: () => void;
  onSuccess: (receipt: OrderReceipt) => void;
}

type FieldName = "name" | "phone" | "city" | "address" | "note";
type Values = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = { name: "", phone: "", city: "", address: "", note: "" };

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  const digits = v.phone.replace(/[\s\-().]/g, "");
  if (!digits) e.phone = "We need a phone number to confirm your order.";
  else if (!/^\+?\d{8,15}$/.test(digits)) e.phone = "Enter a valid phone number, e.g. +383 44 123 456.";
  if (v.city.trim().length < 2) e.city = "Please enter your city.";
  if (v.address.trim().length < 5) e.address = "Please enter a full delivery address.";
  return e;
}

function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  return "FLK-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export function OrderForm({ line, onBack, onSuccess }: OrderFormProps) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const total = PRICE_EUR * line.quantity;

  useEffect(() => () => abortRef.current?.abort(), []);

  const set = (name: FieldName) => (value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    if (attempted) setErrors(validate(next));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const honeypot = new FormData(e.currentTarget).get("botcheck");
    const reference = makeReference();
    const colorLabel = line.color[0].toUpperCase() + line.color.slice(1);

    setStatus("submitting");
    setSubmitError("");
    abortRef.current = new AbortController();
    try {
      await submitToWeb3Forms(
        {
          subject: `New order ${reference} — ${line.product.name} (${colorLabel}, ${line.size}) × ${line.quantity}`,
          from_name: "FLAKE Orders",
          ...(honeypot ? { botcheck: "true" } : {}),
          "Order reference": reference,
          Product: line.product.name,
          Color: colorLabel,
          Size: line.size,
          Quantity: String(line.quantity),
          "Unit price": formatPrice(PRICE_EUR),
          "Order total": formatPrice(total),
          "Payment method": "Cash on Delivery",
          "Full name": values.name.trim(),
          Phone: values.phone.trim(),
          City: values.city.trim(),
          Address: values.address.trim(),
          "Delivery note": values.note.trim() || "—",
        },
        abortRef.current.signal,
      );
      onSuccess({ reference, name: values.name.trim(), phone: values.phone.trim(), total });
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setStatus("error");
      setSubmitError(err instanceof SubmitError ? err.message : "Something went wrong. Please try again.");
    }
  }

  const submitting = status === "submitting";

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="group -ml-1 inline-flex items-center gap-2 rounded-full px-1 py-1 text-[11px] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-white"
      >
        <Arrow direction="left" className="w-4" /> Back to product
      </button>

      <h2 className="mt-6 font-serif text-[2.5rem] leading-none text-white" data-autofocus tabIndex={-1}>
        Your details
      </h2>
      <p className="mt-3 text-[14px] leading-relaxed text-white/55">
        We'll call to confirm, then deliver. Payment is <span className="text-white">cash on delivery</span> — nothing is charged now.
      </p>

      <OrderSummary line={line} total={total} />

      <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-8 space-y-5" aria-busy={submitting}>
        {/* Honeypot: hidden from people, irresistible to bots. */}
        <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <Field label="Full name" name="name" value={values.name} onValue={set("name")} error={errors.name} autoComplete="name" disabled={submitting} />
        <Field
          label="Phone number"
          name="phone"
          type="tel"
          inputMode="tel"
          value={values.phone}
          onValue={set("phone")}
          error={errors.phone}
          autoComplete="tel"
          hint="Used only to confirm your delivery."
          disabled={submitting}
        />
        <div className="grid gap-5 sm:grid-cols-[2fr_3fr]">
          <Field label="City" name="city" value={values.city} onValue={set("city")} error={errors.city} autoComplete="address-level2" disabled={submitting} />
          <Field
            label="Address"
            name="address"
            value={values.address}
            onValue={set("address")}
            error={errors.address}
            autoComplete="street-address"
            disabled={submitting}
          />
        </div>
        <Field
          label="Delivery note"
          optional
          name="note"
          value={values.note}
          onValue={set("note")}
          autoComplete="off"
          placeholder="Floor, landmark, best time to call…"
          disabled={submitting}
        />

        <AnimatePresence>
          {status === "error" && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="liquid-glass rounded-2xl bg-[#ff6b5a]/[0.06] px-5 py-4 text-[13px] leading-relaxed text-[#ffb3a8]"
            >
              <span className="relative z-10">{submitError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-2">
          <GlassButton type="submit" variant="solid" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                Sending order
                <span className="flex gap-1" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1 w-1 rounded-full bg-black"
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18 }}
                    />
                  ))}
                </span>
              </>
            ) : (
              <>
                Place order · {formatPrice(total)}
              </>
            )}
          </GlassButton>
          <p className="mt-4 text-center text-[11px] tracking-[0.14em] text-white/40">Pay {formatPrice(total)} in cash when it arrives</p>
        </div>
        <p className="sr-only" aria-live="polite">
          {submitting ? "Sending your order…" : ""}
        </p>
      </form>
    </div>
  );
}

function OrderSummary({ line, total }: { line: OrderLine; total: number }) {
  return (
    <div className="liquid-glass mt-8 flex items-center gap-4 rounded-2xl p-3 pr-5">
      {line.thumbnail && (
        <img src={line.thumbnail.srcSmall} alt="" className="relative z-10 h-20 w-16 shrink-0 rounded-xl bg-black object-cover" />
      )}
      <dl className="relative z-10 grid flex-1 grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[13px]">
        <dt className="sr-only">Product</dt>
        <dd className="font-serif text-xl leading-tight text-white">{line.product.name}</dd>
        <dt className="sr-only">Total</dt>
        <dd className="text-right text-white">{formatPrice(total)}</dd>
        <dt className="sr-only">Selection</dt>
        <dd className="col-span-2 capitalize text-white/50">
          {line.color} · Size {line.size} · Qty {line.quantity}
        </dd>
      </dl>
    </div>
  );
}

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  label: string;
  name: FieldName;
  value: string;
  onValue: (v: string) => void;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
}

function Field({ label, name, value, onValue, error, hint, optional, className, ...rest }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between text-[11px] uppercase tracking-[0.2em] text-white/55">
        {label}
        {optional && <span className="normal-case tracking-normal text-white/30">Optional</span>}
      </label>
      <div
        className={cn(
          "liquid-glass mt-2 rounded-2xl transition-[background-color,box-shadow] duration-300 focus-within:bg-white/[0.04] focus-within:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]",
          error && "bg-[#ff6b5a]/[0.05] shadow-[inset_0_0_0_1px_rgba(255,138,122,0.35)]",
        )}
      >
        <input
          id={id}
          name={name}
          value={value}
          onChange={(e) => onValue(e.target.value)}
          required={!optional}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className="relative z-10 h-12 w-full bg-transparent px-4 text-[15px] text-white placeholder:text-white/25 focus:outline-none disabled:opacity-50"
          {...rest}
        />
      </div>
      {error ? (
        <p id={errorId} className="mt-2 text-[12px] text-[#ff8a7a]">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="mt-2 text-[12px] text-white/35">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
