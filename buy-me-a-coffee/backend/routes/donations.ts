import { Router, type Request, type Response } from "express";
import { fetchRecentDonations } from "../services/indexer";

export const donationsRouter = Router();

donationsRouter.get("/donations", async (_req: Request, res: Response) => {
  try {
    const donations = await fetchRecentDonations(20);
    res.json({ donations });
  } catch (error) {
    console.error("Failed to fetch donations", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

export default donationsRouter;
