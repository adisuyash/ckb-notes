export type Donation = {
  id: number;
  name: string;
  message: string;
  amountCkb: number;
  time: string;
  txHash?: string;
};

type DonationTableProps = {
  donations: Donation[];
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function DonationTable({
  donations,
  onRefresh,
  refreshing,
}: DonationTableProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition-all duration-200 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            Supporters wall
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Recent coffees from your supporters, fetched directly from the CKB
            blockchain.
          </p>
        </div>
        {onRefresh && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400">Refresh</span>
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              aria-label="Refresh supporters"
              title="Refresh supporters"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-sm hover:border-emerald-400 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
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
        )}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
        <div className="hidden bg-slate-900/70 text-xs font-medium text-slate-300 sm:grid sm:grid-cols-[1.5fr_2.5fr_auto_auto_auto] sm:gap-3 sm:px-3 sm:py-2">
          <div>Name</div>
          <div>Message</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Time</div>
          <div className="text-right">Tx</div>
        </div>
        <div className="divide-y divide-slate-800 bg-slate-950/60">
          {donations.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-slate-500">
              No coffees yet. Be the first to support this creator!
            </p>
          ) : (
            donations.map((donation) => {
              const txHashShort = donation.txHash
                ? `${donation.txHash.slice(0, 10)}...${donation.txHash.slice(
                    -8
                  )}`
                : "";

              return (
                <article
                  key={donation.id}
                  className="flex flex-col gap-1 px-3 py-3 text-xs text-slate-100 sm:grid sm:grid-cols-[1.5fr_2.5fr_auto_auto_auto] sm:items-center sm:gap-3"
                >
                  <div className="font-medium text-slate-100">
                    {donation.name}
                  </div>
                  <div className="text-slate-300">{donation.message}</div>
                  <div className="text-right font-mono text-[11px] text-emerald-300">
                    {donation.amountCkb.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 4,
                    })}{" "}
                    CKB
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    {donation.time}
                  </div>
                  <div className="text-right text-[11px]">
                    {donation.txHash && (
                      <a
                        href={`https://testnet.explorer.nervos.org/transaction/${donation.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-300 underline decoration-dotted underline-offset-2 hover:text-emerald-200"
                      >
                        {txHashShort}
                      </a>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
