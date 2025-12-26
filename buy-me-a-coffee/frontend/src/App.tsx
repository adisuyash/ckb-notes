import { useEffect, useState } from "react";
import { ccc } from "@ckb-ccc/connector-react";
import { WalletStatus } from "./components/WalletStatus";
import { DonationForm } from "./components/DonationForm";
import { DonationTable, type Donation } from "./components/DonationTable";

const MOCK_DONATIONS: Donation[] = [
  {
    id: 3,
    name: "Alice",
    message: "Keep building on CKB!",
    amountCkb: 150,
    time: "2 min ago",
  },
  {
    id: 2,
    name: "Bob",
    message: "Love this project.",
    amountCkb: 80,
    time: "10 min ago",
  },
  {
    id: 1,
    name: "Charlie",
    message: "Coffee on me ☕",
    amountCkb: 50,
    time: "1 hr ago",
  },
];

function App() {
  const { open, wallet } = ccc.useCcc();
  const signer = ccc.useSigner();
  const [address, setAddress] = useState<string | null>(null);

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

  const isConnected = !!wallet && !!address;

  const handleDonationSubmit = async (formData: {
    name: string;
    message: string;
    amountCkb: number;
  }) => {
    if (!address) {
      return;
    }

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

      const data = await response.json();
      console.log("Mock create-donation-tx response", data);
    } catch (error) {
      console.error("Error calling /api/create-donation-tx", error);
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
            on-chain. This page is currently using static data only – blockchain
            and wallet integration will be added in later steps.
          </p>
        </header>

        <section className="mt-6 grid flex-1 gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-4">
            <WalletStatus
              isConnected={isConnected}
              address={address}
              onConnectClick={open}
            />
            <DonationForm
              disabled={!isConnected}
              onSubmit={handleDonationSubmit}
            />
          </div>

          <div className="flex flex-col">
            <DonationTable donations={MOCK_DONATIONS} />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
