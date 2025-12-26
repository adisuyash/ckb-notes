import { Router, type Request, type Response } from "express";

export const createTxRouter = Router();

type CreateDonationTxRequestBody = {
  donorAddress?: string;
  amountCkb?: number;
  name?: string;
  message?: string;
};

createTxRouter.post(
  "/create-donation-tx",
  (
    req: Request<unknown, unknown, CreateDonationTxRequestBody>,
    res: Response
  ) => {
    const { donorAddress, amountCkb, name, message } = req.body || {};

    if (!donorAddress || amountCkb === undefined || !name || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const mockUnsignedTx = {
      mock: true,
      txId: "mock-unsigned-tx-id",
    };

    res.json({
      unsignedTx: mockUnsignedTx,
      preview: {
        donorAddress,
        amountCkb,
        name,
        message,
      },
    });
  }
);

export default createTxRouter;
