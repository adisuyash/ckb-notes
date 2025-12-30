import { FormEvent, useState } from "react";

type DonationFormProps = {
  disabled?: boolean;
  onSubmit?: (data: {
    name: string;
    message: string;
    amountCkb: number;
  }) => boolean | void | Promise<boolean | void>;
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
  const [amount, setAmount] = useState("100");
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

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmittedOnce(true);
    if (!validate()) return;

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) return;

    const result = onSubmit?.({
      name: name.trim(),
      message: message.trim(),
      amountCkb: numericAmount,
    });

    let success = false;

    if (result instanceof Promise) {
      const awaited = await result;
      success = awaited !== false;
    } else {
      success = result !== false;
    }

    if (success) {
      setName("");
      setMessage("");
      setAmount("");
      setErrors({});
      setSubmittedOnce(false);
    }
  }

  function handleBlur() {
    if (submittedOnce) {
      validate();
    }
  }

  const PRESET_AMOUNTS = [100, 1000, 10000];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <h2 className="text-sm font-semibold tracking-wide text-slate-900">
        Buy a coffee
      </h2>
      <p className="mt-1 text-xs text-slate-600">
        Share your name, a short note, and how many coffees you'd like to
        send. Your support and message will appear on the public supporters
        wall.
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
            className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100"
            placeholder="Neon"
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
            className="block w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100"
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
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-14 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100"
              placeholder="100"
              required
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
              CKB
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                disabled={disabled}
                className={`rounded-full border px-2.5 py-1 transition-colors ${
                  amount === String(preset)
                    ? "border-sky-500 bg-sky-100 text-sky-700"
                    : "border-slate-200 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-700"
                } disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400`}
              >
                {preset.toLocaleString()} CKB
              </button>
            ))}
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-400">{errors.amount}</p>
          )}
        </div>

        {disabled && (
          <p className="text-xs text-amber-600">
            Connect a CKB wallet using the button in the top-right to enable
            the donation form.
          </p>
        )}

        <button
          type="submit"
          disabled={disabled}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors duration-150 hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Send donation
        </button>
      </form>
    </section>
  );
}
