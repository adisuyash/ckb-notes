type WalletStatusProps = {
  isConnected: boolean;
  address?: string | null;
  onConnectClick?: () => void;
};

function shortenAddress(address: string) {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletStatus({
  isConnected,
  address,
  onConnectClick,
}: WalletStatusProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm transition-all duration-200 hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200">
            Wallet status
          </h2>
          {isConnected && address ? (
            <div className="mt-1">
              <p className="inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-mono text-slate-100">
                {shortenAddress(address)}
              </p>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-400">
              No wallet connected yet. Connect a CKB-compatible wallet (JoyID,
              Nexus, etc.) to start donating.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onConnectClick}
          className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-slate-950 shadow hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          {isConnected ? "Connected wallet" : "Connect Wallet"}
        </button>
      </div>
    </section>
  );
}
