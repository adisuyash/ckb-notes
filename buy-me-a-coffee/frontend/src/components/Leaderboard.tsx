import { useMemo } from "react";
import type { Donation } from "./DonationTable";

type LeaderboardProps = {
  donations: Donation[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
};

type LeaderboardEntry = {
  name: string;
  totalCkb: number;
  count: number;
  lastTime: string;
};

export function Leaderboard({
  donations,
  isLoading,
  error,
  onRefresh,
}: LeaderboardProps) {
  const entries = useMemo<LeaderboardEntry[]>(() => {
    const map = new Map<string, LeaderboardEntry>();

    for (const donation of donations) {
      const key = donation.name?.trim() || "Anonymous";
      const existing = map.get(key);
      const time = donation.time;

      if (!existing) {
        map.set(key, {
          name: key,
          totalCkb: donation.amountCkb,
          count: 1,
          lastTime: time,
        });
      } else {
        existing.totalCkb += donation.amountCkb;
        existing.count += 1;
        if (new Date(time).getTime() > new Date(existing.lastTime).getTime()) {
          existing.lastTime = time;
        }
      }
    }

    return Array.from(map.values()).sort((a, b) => b.totalCkb - a.totalCkb);
  }, [donations]);

  return (
    <section className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-lg sm:px-8 sm:py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-medium text-slate-800 sm:text-lg">
            Top supporters
          </h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:border-sky-500 hover:text-sky-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          <span>Refresh List</span>
          <svg
            className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.5 5.5A6 6 0 1010 4v2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 4H10.5V0.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {error && <p className="mb-3 text-xs text-rose-400">{error}</p>}

      {isLoading && !entries.length ? (
        <div className="mt-4 space-y-3">
          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ) : entries.length === 0 ? (
        <p className="mt-2 text-sm text-slate-600">
          No supporters yet. Once people start donating, the top supporters will
          appear here.
        </p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="grid grid-cols-[3rem_2fr_auto_auto] items-center gap-3 border-b border-slate-200 bg-slate-100 px-5 py-2.5 text-xs font-semibold text-slate-600 sm:text-sm">
            <div>Rank</div>
            <div>Name</div>
            <div className="text-right">Total donated</div>
            <div className="text-right">Coffees</div>
          </div>
          <div className="divide-y divide-slate-200">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isTop = rank === 1;

              return (
                <div
                  key={entry.name}
                  className={`grid grid-cols-[3rem_2fr_auto_auto] items-center gap-3 px-5 py-2.5 text-xs sm:text-sm ${
                    isTop
                      ? "bg-sky-100 text-slate-900"
                      : "bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="font-semibold text-slate-500">#{rank}</div>
                  <div className="truncate font-medium">{entry.name}</div>
                  <div className="text-right font-mono">
                    {entry.totalCkb.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })}{" "}
                    CKB
                  </div>
                  <div className="text-right text-slate-500">{entry.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
