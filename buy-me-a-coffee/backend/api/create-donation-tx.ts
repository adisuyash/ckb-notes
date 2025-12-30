import { buildUnsignedDonationTx } from "../services/txBuilder";

const MIN_DONATION_CKB = 50;
const MAX_NAME_LENGTH = 32;
const MAX_MESSAGE_LENGTH = 256;

type CreateDonationTxRequestBody = {
  donorAddress?: string;
  amountCkb?: number;
  name?: string;
  message?: string;
};

export default async function handler(req: any, res: any) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST,OPTIONS");
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const body: CreateDonationTxRequestBody = req.body || {};
  const { donorAddress, amountCkb, name, message } = body;

  if (
    !donorAddress ||
    amountCkb === undefined ||
    name === undefined ||
    message === undefined
  ) {
    res.statusCode = 400;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Missing required fields" }));
    return;
  }

  const trimmedName = name.trim();
  const trimmedMessage = message.trim();

  if (!trimmedName || trimmedName.length > MAX_NAME_LENGTH) {
    res.statusCode = 400;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters.`,
      })
    );
    return;
  }

  if (!trimmedMessage || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    res.statusCode = 400;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.`,
      })
    );
    return;
  }

  if (typeof amountCkb !== "number" || Number.isNaN(amountCkb)) {
    res.statusCode = 400;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Amount must be a number." }));
    return;
  }

  if (amountCkb < MIN_DONATION_CKB) {
    res.statusCode = 400;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: `Minimum donation is ${MIN_DONATION_CKB} CKB.`,
      })
    );
    return;
  }

  try {
    const unsignedTx = await buildUnsignedDonationTx({
      donorAddress,
      amountCkb,
      name: trimmedName,
      message: trimmedMessage,
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    res.end(JSON.stringify({ unsignedTx }));
  } catch (error) {
    console.error("Failed to build unsigned donation tx", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: "Failed to build unsigned donation transaction.",
      })
    );
  }
}
