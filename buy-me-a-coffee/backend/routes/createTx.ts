import { Router, type Request, type Response } from "express";
import { buildUnsignedDonationTx } from "../services/txBuilder";

export const createTxRouter = Router();

const MIN_DONATION_CKB = 50;
const MAX_NAME_LENGTH = 32;
const MAX_MESSAGE_LENGTH = 256;

type CreateDonationTxRequestBody = {
  donorAddress?: string;
  amountCkb?: number;
  name?: string;
  message?: string;
};

createTxRouter.post(
  "/create-donation-tx",
  async (
    req: Request<unknown, unknown, CreateDonationTxRequestBody>,
    res: Response
  ) => {
    const { donorAddress, amountCkb, name, message } = req.body || {};

    if (
      !donorAddress ||
      amountCkb === undefined ||
      name === undefined ||
      message === undefined
    ) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || trimmedName.length > MAX_NAME_LENGTH) {
      res.status(400).json({
        error: `Name must be between 1 and ${MAX_NAME_LENGTH} characters.`,
      });
      return;
    }

    if (!trimmedMessage || trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      res.status(400).json({
        error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.`,
      });
      return;
    }

    if (typeof amountCkb !== "number" || Number.isNaN(amountCkb)) {
      res.status(400).json({ error: "Amount must be a number." });
      return;
    }

    if (amountCkb < MIN_DONATION_CKB) {
      res.status(400).json({
        error: `Minimum donation is ${MIN_DONATION_CKB} CKB.`,
      });
      return;
    }

    try {
      const unsignedTx = await buildUnsignedDonationTx({
        donorAddress,
        amountCkb,
        name: trimmedName,
        message: trimmedMessage,
      });

      res.json({ unsignedTx });
    } catch (error) {
      console.error("Failed to build unsigned donation tx", error);
      res
        .status(500)
        .json({ error: "Failed to build unsigned donation transaction." });
    }
  }
);

export default createTxRouter;
