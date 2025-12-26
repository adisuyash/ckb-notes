export type Donation = {
  id: number;
  name: string;
  message: string;
  amountCkb: number;
  time: string;
};

type DonationTableProps = {
  donations: Donation[];
};

export function DonationTable({ donations }: DonationTableProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            Supporters wall
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Recent coffees from your supporters. Soon this will be populated
            from real on-chain data.
          </p>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-slate-800">
        <div className="hidden bg-slate-900/70 text-xs font-medium text-slate-300 sm:grid sm:grid-cols-[1.5fr_2.5fr_auto_auto] sm:gap-3 sm:px-3 sm:py-2">
          <div>Name</div>
          <div>Message</div>
          <div className="text-right">Amount</div>
          <div className="text-right">Time</div>
        </div>
        <div className="divide-y divide-slate-800 bg-slate-950/60">
          {donations.length === 0 ? (
            <p className="px-3 py-4 text-center text-xs text-slate-500">
              No coffees yet. Be the first to support this builder!
            </p>
          ) : (
            donations.map((donation) => (
              <article
                key={donation.id}
                className="flex flex-col gap-1 px-3 py-3 text-xs text-slate-100 sm:grid sm:grid-cols-[1.5fr_2.5fr_auto_auto] sm:items-center sm:gap-3"
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
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
