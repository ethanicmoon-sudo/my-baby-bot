import { afterEach, describe, expect, it, vi } from "vitest";
import { assertBinanceReady, signPayload, submitBinanceWithdrawal } from "./binance";

const originalEnv = { ...process.env };

afterEach(() => {
  vi.restoreAllMocks();
  process.env = { ...originalEnv };
});

describe("Binance withdrawal client", () => {
  it("signs payloads with Binance-compatible HMAC SHA256", () => {
    expect(signPayload("timestamp=1578963600000", "test-secret")).toBe(
      "67905e7544d2908f05edbc8e62c38ea13a42940887c974941f14826e9c3d0e49",
    );
  });

  it("requires withdrawals to be explicitly enabled", () => {
    process.env.BINANCE_API_KEY = "key";
    process.env.BINANCE_API_SECRET = "secret";
    process.env.BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES = "TAllowed";

    expect(() => assertBinanceReady("TAllowed", "10")).toThrow(/disabled/i);
  });

  it("blocks non-allowlisted destination addresses", () => {
    process.env.BINANCE_WITHDRAWALS_ENABLED = "true";
    process.env.BINANCE_API_KEY = "key";
    process.env.BINANCE_API_SECRET = "secret";
    process.env.BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES = "TAllowed";

    expect(() => assertBinanceReady("TOther", "10")).toThrow(/not in BINANCE_ALLOWED/i);
  });

  it("submits signed withdrawal requests to Binance", async () => {
    process.env.BINANCE_WITHDRAWALS_ENABLED = "true";
    process.env.BINANCE_API_KEY = "key";
    process.env.BINANCE_API_SECRET = "secret";
    process.env.BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES = "TAllowed";
    process.env.BINANCE_API_BASE_URL = "https://example.test";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "withdrawal-id" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(submitBinanceWithdrawal({
      coin: "USDT",
      network: "TRX",
      address: "TAllowed",
      amount: "12.5",
      withdrawOrderId: "order-1",
    })).resolves.toEqual({ id: "withdrawal-id" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.test/sapi/v1/capital/withdraw/apply",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "X-MBX-APIKEY": "key" }),
      }),
    );
  });
});
