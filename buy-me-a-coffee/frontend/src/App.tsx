import { useEffect, useState } from "react";
import { ccc } from "@ckb-ccc/connector-react";
import { WalletStatus } from "./components/WalletStatus";
import { DonationForm } from "./components/DonationForm";
import { DonationTable, type Donation } from "./components/DonationTable";

const cccAny = ccc as any;

function App() {
  const { open, wallet } = ccc.useCcc();
  const signer = ccc.useSigner();
  const [address, setAddress] = useState<string | null>(null);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donationsError, setDonationsError] = useState<string | null>(null);

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

  useEffect(() => {
    let cancelled = false;

    async function fetchDonations() {
      try {
        setDonationsError(null);
        const response = await fetch("http://localhost:4000/api/donations");
        if (!response.ok) {
          throw new Error(`Failed to load donations (${response.status})`);
        }
        const body = await response.json();
        const items = (body?.donations ?? []) as Donation[];

        if (!cancelled) {
          setDonations(
            items
              .slice()
              .sort(
                (a, b) =>
                  new Date(b.time).getTime() - new Date(a.time).getTime()
              )
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load donations", error);
          setDonationsError("Failed to load recent donations.");
        }
      }
    }

    fetchDonations();

    return () => {
      cancelled = true;
    };
  }, []);

  const isConnected = !!wallet && !!address;

  const handleDonationSubmit = async (formData: {
    name: string;
    message: string;
    amountCkb: number;
  }) => {
    if (!address || !signer) {
      setSubmitError("Wallet is not ready. Please reconnect and try again.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(
        "http://localhost:4000/api/create-donation-tx",
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
        setIsSubmitting(false);
        return;
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
    } catch (error) {
      console.error("Error creating or sending donation transaction", error);
      setSubmitError("Error creating or sending donation transaction.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8">
        <header className="space-y-3 border-b border-slate-800 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Nervos CKB • Demo dApp
          </p>
          <h1 className="text-2xl font-semibold sm:text-3xl">
            Buy Me a Coffee
          </h1>
          <p className="max-w-2xl text-sm text-slate-300">
            Support this builder with a small CKB donation and leave a message
            on-chain. Donations are sent on the Nervos CKB testnet, and the
            supporters wall below will soon be powered by on-chain data.
          </p>
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

        <section className="mt-6 grid flex-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <WalletStatus
              isConnected={isConnected}
              address={address}
              onConnectClick={open}
            />
            <DonationForm
              disabled={!isConnected || isSubmitting}
              onSubmit={handleDonationSubmit}
            />
          </div>

          <div className="flex flex-col">
            <DonationTable donations={donations} />
            {donationsError && (
              <p className="mt-2 text-xs text-rose-400">{donationsError}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
