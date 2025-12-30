import { useEffect, useMemo, useRef } from "react";
import type { Donation } from "./DonationTable";

type DonationCarouselProps = {
  donations: Donation[];
  isLoading?: boolean;
};

function formatRelativeTime(isoTime: string): string {
  const date = new Date(isoTime);
  if (Number.isNaN(date.getTime())) return isoTime;

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function DonationCarousel({ donations, isLoading }: DonationCarouselProps) {
  const items = useMemo(
    () =>
      donations
        .slice()
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()),
    [donations]
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Simple auto-scroll ticker effect
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let frameId: number;
    const speed = 0.4; // px per frame

    const step = () => {
      if (!container) return;
      if (container.scrollWidth <= container.clientWidth) {
        frameId = requestAnimationFrame(step);
        return;
      }

      container.scrollLeft += speed;
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (container.scrollLeft >= maxScroll - 1) {
        container.scrollLeft = 0;
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [items.length]);

  if (isLoading && !items.length) {
    return (
      <div className="mt-4 flex gap-4 overflow-hidden">
        <div className="h-24 w-64 animate-pulse rounded-2xl bg-white/60" />
        <div className="h-24 w-64 animate-pulse rounded-2xl bg-white/60" />
        <div className="h-24 w-64 animate-pulse rounded-2xl bg-white/60" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <p className="mt-4 text-xs text-slate-600">
        No coffees yet. Be the first to support this creator!
      </p>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="mt-6 flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
    >
      {items.concat(items.length > 3 ? items : []).map((donation, idx) => {
        const initials = donation.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "?")
          .join("");

        return (
          <article
            key={`${donation.id}-${idx}`}
            className="min-w-[15.5rem] max-w-xs flex-1 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-md ring-1 ring-slate-200 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-xs font-semibold text-sky-700 ring-1 ring-sky-500/40">
                  {initials || "?"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {donation.name || "Anonymous"}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatRelativeTime(donation.time)}
                  </p>
                </div>
              </div>
              <p className="text-right text-xs font-mono text-emerald-600">
                {donation.amountCkb.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 4,
                })}{" "}
                <span className="text-[11px] text-emerald-600/90">CKB</span>
              </p>
            </div>

            {donation.message && (
              <p className="mt-2 line-clamp-2 text-[11px] text-slate-700">
                {donation.message}
              </p>
            )}

            {donation.txHash && (
              <a
                href={`https://testnet.explorer.nervos.org/transaction/${donation.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-[11px] text-sky-600 underline decoration-dotted underline-offset-2 hover:text-sky-500"
              >
                View transaction
              </a>
            )}
          </article>
        );
      })}
    </div>
  );
}
