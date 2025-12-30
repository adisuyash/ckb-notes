import { ccc } from "@ckb-ccc/shell";

const DONATION_RECEIVER_ADDRESS =
  process.env.DONATION_RECEIVER_ADDRESS ||
  "ckt1qrejnmlar3r452tcg57gvq8patctcgy8acync0hxfnyka35ywafvkqgjyfw45yrezg066pg2xw7lzdem4ac65sseqqlj2cvk";

const cccAny = ccc as any;
const cccClient = new cccAny.ClientPublicTestnet();

export type BuildDonationTxParams = {
  donorAddress: string;
  amountCkb: number;
  name: string;
  message: string;
};

export type UnsignedDonationTx = {
  outputs: Array<{
    lock: unknown;
    capacity: string;
  }>;
  outputsData: string[];
};

function utf8ToHex(utf8String: string): string {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(utf8String);

  return (
    "0x" +
    Array.prototype.map
      .call(uint8Array, (byte: number) => {
        return ("0" + (byte & 0xff).toString(16)).slice(-2);
      })
      .join("")
  );
}

export async function buildUnsignedDonationTx(
  params: BuildDonationTxParams
): Promise<UnsignedDonationTx> {
  const { donorAddress, amountCkb, name, message } = params;

  if (!donorAddress) {
    throw new Error("Donor address is required");
  }

  const donationAmountFixed = cccAny.fixedPointFrom(amountCkb.toString());

  const { script: toLock } = await cccAny.Address.fromString(
    DONATION_RECEIVER_ADDRESS,
    cccClient
  );

  const payloadJson = JSON.stringify({ n: name, m: message });
  const payloadHex = utf8ToHex(payloadJson);

  return {
    outputs: [
      {
        lock: toLock,
        capacity: cccAny.fixedPointToString(donationAmountFixed),
      },
    ],
    outputsData: [payloadHex],
  };
}
