import { cn } from "../lib/cn";

export function Logo({ className, withWordmark = true }: { className?: string; withWordmark?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img src="/fire.png" alt="" aria-hidden="true" width={28} height={28} className="h-7 w-7 object-contain" />
      {withWordmark && (
        <span className="translate-y-[1px] font-serif text-[1.35rem] leading-none tracking-[0.02em] text-white">FLAKE</span>
      )}
    </span>
  );
}
