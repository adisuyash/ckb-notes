import { useCallback, useEffect, useState } from "react";
import { ccc } from "@ckb-ccc/connector-react";
import { DonationForm } from "./components/DonationForm";
import type { Donation } from "./components/DonationTable";
import { DonationCarousel } from "./components/DonationCarousel";
import { Leaderboard } from "./components/Leaderboard";

const cccAny = ccc as any;

const envApiBase =
  ((import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined) ?? "";

let defaultApiBase = "http://localhost:4000";
if (typeof window !== "undefined") {
  const host = window.location.hostname;
  if (host !== "localhost" && host !== "127.0.0.1") {
    defaultApiBase = window.location.origin;
  }
}

const API_BASE_URL =
  envApiBase && envApiBase.trim() !== "" ? envApiBase.trim() : defaultApiBase;

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
      const response = await fetch(`${API_BASE_URL}/api/create-donation-tx`, {
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
      });

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
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6">
        <nav className="flex items-center justify-between rounded-full bg-sky-100/80 px-4 py-2 text-sm shadow-sm ring-1 ring-sky-200/80">
          <button
            type="button"
            onClick={() => setActiveView("support")}
            className="flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-sky-100"
          >
            <img src="/main.svg" alt="CKB Coffee logo" className="h-8 w-8" />
            <span className="text-sm font-semibold tracking-wide text-slate-800">
              CKB Coffee
            </span>
          </button>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-700 sm:flex">
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

        {lastTxHash && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setLastTxHash(null)}
          >
            <div
              className="relative mx-4 w-full max-w-md rounded-3xl bg-emerald-50/95 p-5 shadow-2xl ring-1 ring-emerald-100"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLastTxHash(null)}
                className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500"
                aria-label="Close"
              >
                X
              </button>

              <div className="mt-2 flex flex-col items-center gap-4">
                <div className="relative flex h-24 w-32 items-center justify-center overflow-hidden rounded-2xl p-1 bg-emerald-100">
                  <img
                    src="/thankyou.svg"
                    alt="Thank you for your support"
                    className="relative h-full w-full object-contain"
                  />
                </div>
                <div className="w-full text-center">
                  <p className="text-sm font-semibold text-emerald-700">
                    Thank you so much!
                  </p>
                  <p className="mt-1 text-xs text-slate-700">
                    Your donation was sent successfully. <br />
                  </p>
                  <a
                    href={`https://testnet.explorer.nervos.org/transaction/${lastTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex text-[11px] font-mono text-sky-700 underline decoration-dotted underline-offset-2 hover:text-sky-600"
                  >
                    Click here to view transaction &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="mt-8 flex flex-1 flex-col items-center">
          <header className="text-center">
            {activeView === "support" ? (
              <>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
                  Raised so far
                </p>
                <p className="mt-2 text-4xl font-bold text-slate-900">
                  {totalRaised.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 4,
                  })}{" "}
                  CKB
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Send a CKB “coffee” and leave a public message of support.
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
                  <span className="text-sm font-medium text-slate-700">
                    Recent supporters
                  </span>
                  <button
                    type="button"
                    onClick={fetchDonations}
                    disabled={isDonationsLoading}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-700 shadow-sm transition-colors hover:border-sky-400 hover:text-sky-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
                  >
                    <span className="text-xs font-medium text-slate-700">
                      Refresh
                    </span>
                    <svg
                      className={`h-3.5 w-3.5 ${
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
            <section className="mt-10 flex w-full flex-1 justify-center">
              <Leaderboard
                donations={donations}
                isLoading={isDonationsLoading}
                error={donationsError}
                onRefresh={fetchDonations}
              />
            </section>
          )}
        </main>
        <footer className="mt-8 flex justify-center border-t border-sky-200 pt-4 text-xs text-slate-500">
          <span>
            Built by{" "}
            <a
              href="https://x.com/adisuyash"
              className="hover:text-sky-700 hover:shadow-sm"
            >
              @adisuyash
            </a>
            {" :)"}
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
