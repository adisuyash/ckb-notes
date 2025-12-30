import { ccc } from "@ckb-ccc/shell";

const DONATION_RECEIVER_ADDRESS =
  process.env.DONATION_RECEIVER_ADDRESS ||
  "ckt1qrejnmlar3r452tcg57gvq8patctcgy8acync0hxfnyka35ywafvkqgjyfw45yrezg066pg2xw7lzdem4ac65sseqqlj2cvk";

const cccAny = ccc as any;
const cccClient = new cccAny.ClientPublicTestnet();

export type IndexedDonation = {
  id: number;
  name: string;
  message: string;
  amountCkb: number;
  time: string;
  txHash: string;
};

function hexToUtf8(hex: string): string {
  const normalized = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (!normalized) return "";

  const bytes = new Uint8Array(
    normalized.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
  );
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export async function fetchRecentDonations(
  limit: number = 20
): Promise<IndexedDonation[]> {
  const { script: lock } = await cccAny.Address.fromString(
    DONATION_RECEIVER_ADDRESS,
    cccClient
  );

  type RawDonation = {
    name: string;
    message: string;
    amountCkb: number;
    time: string;
    txHash: string;
    blockNumber: number;
  };

  const results: RawDonation[] = [];

  for await (const cell of cccClient.findCellsByLock(
    lock,
    undefined,
    true,
    "desc",
    limit * 2
  )) {
    if (results.length >= limit) {
      break;
    }

    try {
      const outPoint = (cell as any).outPoint;
      const outputData = (cell as any).outputData as string | undefined;
      const capacity = (cell as any).cellOutput?.capacity;

      if (!outPoint || !outputData || outputData === "0x") {
        continue;
      }

      const jsonString = hexToUtf8(outputData);
      if (!jsonString) {
        continue;
      }

      let parsed: any;
      try {
        parsed = JSON.parse(jsonString);
      } catch {
        continue;
      }

      const name = typeof parsed.n === "string" ? parsed.n : undefined;
      const message = typeof parsed.m === "string" ? parsed.m : undefined;

      if (!name || !message || !capacity) {
        continue;
      }

      const amountCkbString = cccAny.fixedPointToString(capacity);
      const amountCkb = Number(amountCkbString);

      const txHash: string = outPoint.txHash;
      let time = new Date().toISOString();
      let blockNumber = 0;

      try {
        const txWithHeader = await cccClient.getTransactionWithHeader(txHash);
        const header = txWithHeader?.header;
        if (header) {
          blockNumber = Number(header.number);
          const ts = Number(header.timestamp);
          if (!Number.isNaN(ts) && ts > 0) {
            time = new Date(ts).toISOString();
          }
        }
      } catch {
        blockNumber = 0;
      }

      results.push({
        name,
        message,
        amountCkb,
        time,
        txHash,
        blockNumber,
      });
    } catch {
      continue;
    }
  }

  results.sort((a, b) => b.blockNumber - a.blockNumber);

  return results.map((item, index) => ({
    id: index + 1,
    name: item.name,
    message: item.message,
    amountCkb: item.amountCkb,
    time: item.time,
    txHash: item.txHash,
  }));
}
