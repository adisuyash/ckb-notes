import { useCallback, useEffect, useState } from "react";
import { ccc } from "@ckb-ccc/connector-react";
import { DonationForm } from "./components/DonationForm";
import { DonationTable, type Donation } from "./components/DonationTable";
import { DonationCarousel } from "./components/DonationCarousel";
import { Leaderboard } from "./components/Leaderboard";

const cccAny = ccc as any;

const envApiBase =
  (((import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined) ?? "");

let defaultApiBase = "http://localhost:4000";
if (typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") {
    defaultApiBase = window.location.origin;
  }
}

const API_BASE_URL =
  envApiBase && envApiBase.trim() !== ""
    ? envApiBase.trim()
    : defaultApiBase;

function App() {
  const cccCtx = ccc.useCcc() as any;
  const { open, wallet } = cccCtx;
  const disconnect = cccCtx?.disconnect ?? cccCtx?.close ?? null;
  const signer = ccc.useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationsError, setDonationsError] = useState<string | null>(null);
  const [isDonationsLoading, setIsDonationsLoading] = useState(false);
  const [activeView, setActiveView] = useState<"support" | "leaderboard">(
    "support"
  );

  useEffect(() => {
    if (!signer) {
      setAddress(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const addr = await signer.getRecommendedAddress();
        if (!cancelled) {
          setAddress(addr);
        }
      } catch {
        if (!cancelled) {
          setAddress(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [signer]);

  const fetchDonations = useCallback(async () => {
    setDonationsError(null);
    setIsDonationsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations`);
      if (!response.ok) {
        throw new Error(`Failed to load donations (${response.status})`);
      }
      const body = await response.json();
      const items = (body?.donations ?? []) as Donation[];

      setDonations(
        items
          .slice()
          .sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
          )
      );
    } catch (error) {
      console.error("Failed to load donations", error);
      setDonationsError("Failed to load recent donations.");
    } finally {
      setIsDonationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const isConnected = !!wallet && !!address;

  const handleDonationSubmit = async (formData: {
    name: string;
    message: string;
    amountCkb: number;
  }) => {
    if (!address || !signer) {
      setSubmitError("Wallet is not ready. Please reconnect and try again.");
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    let success = false;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/create-donation-tx`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donorAddress: address,
            amountCkb: formData.amountCkb,
            name: formData.name,
            message: formData.message,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage = "Failed to prepare donation transaction.";
        try {
          const body = await response.json();
          if (body && typeof body.error === "string") {
            errorMessage = body.error;
          }
        } catch {
          // ignore
        }
        setSubmitError(errorMessage);
        return false;
      }

      const { unsignedTx } = await response.json();

      const tx = cccAny.Transaction.from({
        outputs: (unsignedTx.outputs || []).map((output: any) => ({
          lock: output.lock,
        })),
        outputsData: unsignedTx.outputsData || [],
      });

      tx.outputs.forEach((output: any) => {
        output.capacity = cccAny.fixedPointFrom(formData.amountCkb.toString());
      });

      await tx.completeInputsByCapacity(signer);
      await tx.completeFeeBy(signer, 2000);

      const txHash = await signer.sendTransaction(tx);
      setLastTxHash(txHash);
      console.log("Donation transaction sent", txHash);

      await fetchDonations();
      success = true;
    } catch (error) {
      console.error("Error creating or sending donation transaction", error);
      setSubmitError("Error creating or sending donation transaction.");
      success = false;
    } finally {
      setIsSubmitting(false);
    }

    return success;
  };

  const totalRaised = donations.reduce(
    (sum, donation) => sum + (donation.amountCkb || 0),
    0
  );

  const handleDisconnectClick = async () => {
    if (wallet && disconnect) {
      try {
        await Promise.resolve(disconnect());
      } catch (error) {
        console.error("Failed to disconnect wallet", error);
      }
      setAddress(null);
      return;
    }
  };

  const handleConnectClick = () => {
    open();
  };

  return (
    <div className="min-h-screen bg-sky-100 text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6">
        <nav className="flex items-center justify-between rounded-full bg-sky-100/80 px-4 py-2 text-sm shadow-sm ring-1 ring-sky-200/80">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              C
            </div>
            <span className="text-xs font-semibold tracking-wide text-slate-800">
              CKB Coffee
            </span>
          </div>
          <div className="hidden items-center gap-5 text-[11px] font-medium text-slate-700 sm:flex">
            <button
              type="button"
              onClick={() => setActiveView("support")}
              className={
                activeView === "support"
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }
            >
              Support
            </button>
            <button
              type="button"
              onClick={() => setActiveView("leaderboard")}
              className={
                activeView === "leaderboard"
                  ? "text-slate-900"
                  : "text-slate-600 hover:text-slate-900"
              }
            >
              Leaderboard
            </button>
          </div>

          {isConnected && address ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleConnectClick}
                className="flex items-center gap-3 rounded-full bg-slate-900 px-3 py-1.5 text-[11px] text-white shadow-md ring-1 ring-slate-800 hover:bg-slate-800"
              >
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[9px] uppercase tracking-[0.16em] text-slate-400">
                    Wallet
                  </span>
                  <span className="font-mono text-[10px] text-slate-100">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={handleDisconnectClick}
                className="inline-flex items-center rounded-full border border-rose-500 bg-rose-600 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-rose-500"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleConnectClick}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-[11px] font-medium text-white shadow-md transition-colors hover:bg-slate-800"
            >
              <span>Connect wallet</span>
            </button>
          )}
        </nav>

        <main className="mt-8 flex flex-1 flex-col items-center">
          <header className="text-center">
            {activeView === "support" ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
                  Together we've raised
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {totalRaised.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}{" "}
                  CKB
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Support this creator with a CKB "coffee" and a public
                  message. Your support appears on the live feed below.
                </p>
              </>
            ) : (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
                  Top supporters
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  Leaderboard
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Ranked by total CKB donated using the name they entered.
                </p>
              </>
            )}
          </header>

        {lastTxHash && (
          <p className="mt-3 text-xs text-emerald-300">
            Last donation transaction hash:{" "}
            <a
              href={`https://testnet.explorer.nervos.org/transaction/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-emerald-200"
            >
              {lastTxHash}
            </a>
          </p>
        )}
        {submitError && (
          <p className="mt-3 text-xs text-rose-400">{submitError}</p>
        )}
          {activeView === "support" ? (
            <section className="mt-8 flex w-full flex-1 flex-col items-center">
              <div className="w-full max-w-md">
                <DonationForm
                  disabled={!isConnected || isSubmitting}
                  onSubmit={handleDonationSubmit}
                />
              </div>

              <section className="mt-8 w-full">
                <div className="flex items-center justify-between px-1 text-xs text-slate-700">
                  <span>Recent supporters</span>
                  <button
                    type="button"
                    onClick={fetchDonations}
                    disabled={isDonationsLoading}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition-colors hover:border-sky-400 hover:text-sky-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    <span>Refresh</span>
                    <svg
                      className={`h-3 w-3 ${
                        isDonationsLoading ? "animate-spin" : ""
                      }`}
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

                <DonationCarousel
                  donations={donations}
                  isLoading={isDonationsLoading}
                />
                {donationsError && (
                  <p className="mt-2 px-1 text-xs text-rose-500">
                    {donationsError}
                  </p>
                )}
              </section>
            </section>
          ) : (
            <section className="mt-8 flex w-full max-w-3xl flex-1">
              <Leaderboard
                donations={donations}
                isLoading={isDonationsLoading}
                error={donationsError}
                onRefresh={fetchDonations}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
