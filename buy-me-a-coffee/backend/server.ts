import express, { type Request, type Response } from "express";
import cors from "cors";
import createTxRouter from "./routes/createTx";
import donationsRouter from "./routes/donations";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api", createTxRouter);
app.use("/api", donationsRouter);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
