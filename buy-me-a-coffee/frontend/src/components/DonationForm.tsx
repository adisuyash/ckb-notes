import { FormEvent, useState } from "react";

type DonationFormProps = {
  disabled?: boolean;
  onSubmit?: (data: {
    name: string;
    message: string;
    amountCkb: number;
  }) => void;
};

type FieldErrors = {
  name?: string;
  message?: string;
  amount?: string;
};

export function DonationForm({
  disabled = false,
  onSubmit,
}: DonationFormProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedOnce, setSubmittedOnce] = useState(false);

  function validate(): boolean {
    const nextErrors: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      nextErrors.name = "Name is required.";
    } else if (trimmedName.length > 32) {
      nextErrors.name = "Name must be at most 32 characters.";
    }

    if (!trimmedMessage) {
      nextErrors.message = "Message is required.";
    } else if (trimmedMessage.length > 256) {
      nextErrors.message = "Message must be at most 256 characters.";
    }

    const numericAmount = Number(amount);
    if (!amount) {
      nextErrors.amount = "Amount is required.";
    } else if (Number.isNaN(numericAmount)) {
      nextErrors.amount = "Amount must be a number.";
    } else if (numericAmount < 50) {
      nextErrors.amount = "Minimum donation is 50 CKB.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmittedOnce(true);
    if (!validate()) return;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) return;

    onSubmit?.({
      name: name.trim(),
      message: message.trim(),
      amountCkb: numericAmount,
    });
  }

  function handleBlur() {
    if (submittedOnce) {
      validate();
    }
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
      <h2 className="text-sm font-semibold tracking-wide text-slate-200">
        Buy me a coffee
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Enter your name, a short message, and how many CKB you want to send.
        Submitting will create an on-chain donation on the CKB testnet.
      </p>

      <form
        onSubmit={handleSubmit}
        onBlur={handleBlur}
        className="mt-4 space-y-3"
      >
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-slate-200"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="off"
            maxLength={64}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            className="block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900"
            placeholder="Satoshi"
            required
          />
          {errors.name && (
            <p className="text-xs text-rose-400">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="block text-xs font-medium text-slate-200"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={disabled}
            className="block w-full resize-none rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900"
            placeholder="Keep building on CKB!"
            required
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{message.trim().length}/256 characters</span>
            {errors.message && (
              <span className="text-rose-400">{errors.message}</span>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="amount"
            className="block text-xs font-medium text-slate-200"
          >
            Amount (CKB)
          </label>
          <div className="relative">
            <input
              id="amount"
              name="amount"
              type="number"
              min={50}
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={disabled}
              className="block w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 pr-14 text-sm text-slate-100 shadow-sm outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900"
              placeholder="50"
              required
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
              CKB
            </span>
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-400">{errors.amount}</p>
          )}
        </div>

        {disabled && (
          <p className="text-xs text-amber-300">
            Connect a CKB wallet above to enable the donation form.
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400"
        >
          Send donation
        </button>
      </form>
    </section>
  );
}
