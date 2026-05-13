import crypto from "node:crypto";

const DEFAULT_BASE_URL = "https://api.binance.com";
const DEFAULT_RECV_WINDOW = "5000";

export type BinanceWithdrawInput = {
  coin: string;
  address: string;
  amount: string;
  network?: string;
  addressTag?: string;
  walletType?: 0 | 1;
  withdrawOrderId: string;
};

export type BinanceWithdrawResult = {
  id: string;
};

export type BinanceStatus = {
  configured: boolean;
  enabled: boolean;
  baseUrl: string;
  allowedAddressCount: number;
  maxAmount?: string;
};

export function getBinanceStatus(): BinanceStatus {
  return {
    configured: Boolean(process.env.BINANCE_API_KEY && process.env.BINANCE_API_SECRET),
    enabled: process.env.BINANCE_WITHDRAWALS_ENABLED === "true",
    baseUrl: getBaseUrl(),
    allowedAddressCount: getAllowedAddresses().size,
    maxAmount: process.env.BINANCE_MAX_WITHDRAW_AMOUNT,
  };
}

export function assertBinanceReady(address: string, amount: string) {
  if (process.env.BINANCE_WITHDRAWALS_ENABLED !== "true") {
    throw new Error("Binance withdrawals are disabled. Set BINANCE_WITHDRAWALS_ENABLED=true after you finish setup.");
  }

  if (!process.env.BINANCE_API_KEY || !process.env.BINANCE_API_SECRET) {
    throw new Error("Binance API credentials are missing on the server.");
  }

  const allowedAddresses = getAllowedAddresses();
  if (allowedAddresses.size === 0) {
    throw new Error("BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES must contain at least one approved destination address.");
  }

  if (!allowedAddresses.has(address.trim())) {
    throw new Error("This destination address is not in BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES.");
  }

  const maxAmount = process.env.BINANCE_MAX_WITHDRAW_AMOUNT;
  if (maxAmount && Number(amount) > Number(maxAmount)) {
    throw new Error(`Amount is above BINANCE_MAX_WITHDRAW_AMOUNT (${maxAmount}).`);
  }
}

export async function submitBinanceWithdrawal(input: BinanceWithdrawInput): Promise<BinanceWithdrawResult> {
  assertBinanceReady(input.address, input.amount);

  const params = new URLSearchParams();
  params.set("coin", input.coin.toUpperCase());
  params.set("address", input.address.trim());
  params.set("amount", input.amount);
  params.set("withdrawOrderId", input.withdrawOrderId);
  params.set("walletType", String(input.walletType ?? 0));
  params.set("recvWindow", process.env.BINANCE_RECV_WINDOW ?? DEFAULT_RECV_WINDOW);
  params.set("timestamp", String(Date.now()));

  if (input.network) params.set("network", input.network.toUpperCase());
  if (input.addressTag) params.set("addressTag", input.addressTag);

  const payload = params.toString();
  const signature = signPayload(payload, process.env.BINANCE_API_SECRET ?? "");
  params.set("signature", signature);

  const response = await fetch(`${getBaseUrl()}/sapi/v1/capital/withdraw/apply`, {
    method: "POST",
    headers: {
      "X-MBX-APIKEY": process.env.BINANCE_API_KEY ?? "",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const body = await response.json().catch(async () => ({ msg: await response.text().catch(() => response.statusText) }));

  if (!response.ok) {
    const message = typeof body?.msg === "string" ? body.msg : response.statusText;
    throw new Error(`Binance withdrawal failed (${response.status}): ${message}`);
  }

  if (!body || typeof body.id !== "string") {
    throw new Error("Binance returned an unexpected withdrawal response.");
  }

  return { id: body.id };
}

export function signPayload(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function getBaseUrl() {
  return (process.env.BINANCE_API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
}

function getAllowedAddresses() {
  return new Set(
    (process.env.BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES ?? "")
      .split(",")
      .map(address => address.trim())
      .filter(Boolean),
  );
}
