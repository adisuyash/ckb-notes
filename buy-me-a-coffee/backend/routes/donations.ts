import { Router, type Request, type Response } from "express";

export const donationsRouter = Router();

donationsRouter.get("/donations", (_req: Request, res: Response) => {
  const mockDonations = [
    {
      id: 3,
      name: "Alice",
      message: "Keep building on CKB!",
      amountCkb: 150,
      time: "2025-01-01T12:00:00.000Z",
      txHash: "0xmockalice",
    },
    {
      id: 2,
      name: "Bob",
      message: "Love this project.",
      amountCkb: 80,
      time: "2025-01-01T11:45:00.000Z",
      txHash: "0xmockbob",
    },
    {
      id: 1,
      name: "Charlie",
      message: "Coffee on me ☕",
      amountCkb: 50,
      time: "2025-01-01T11:00:00.000Z",
      txHash: "0xmockcharlie",
    },
  ];

  res.json({ donations: mockDonations });
});

export default donationsRouter;
