# Binance Withdrawals Setup

This app can submit real Binance withdrawals from the server only. Never put API keys in client code or commit them to git.

## Required server environment variables

```bash
BINANCE_API_KEY=Sse0YvRCoCnvmZzsn0r3Cz3WPd04kq5VVxUBxF7GN3k5Fw1jgHtUfVLhk5awlGnL
BINANCE_API_SECRET=9re8lLjv8NXQCqdkJddaQUiF5QyLrk313yPWuZsEbBIheRvwwsuXq0wRTTuEyb9R
BINANCE_WITHDRAWALS_ENABLED=true
BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES=bc1pxv5pp9cq06ppdd26zuw84ar9ckvmhj77h0zqdez84t9lln30ce5q5ku6gh
BINANCE_MAX_WITHDRAW_AMOUNT=100
BINANCE_RECV_WINDOW=5000
BINANCE_API_BASE_URL=https://api.binance.com
```

Set `BINANCE_WITHDRAWALS_ENABLED=true` only after:

1. Binance API key is restricted to the server IP address.
2. Withdrawal permission is enabled only on the key intended for this app.
3. `BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES` contains only your own approved destination addresses.
4. A small `BINANCE_MAX_WITHDRAW_AMOUNT` is set for the first live test.
5. The first live test uses the minimum amount supported by the selected coin/network.

## Runtime safeguards

- The browser never receives the Binance API key or secret.
- The server blocks withdrawals unless withdrawals are explicitly enabled.
- The server blocks destinations outside `BINANCE_ALLOWED_WITHDRAWAL_ADDRESSES`.
- The UI requires the exact confirmation phrase: `WITHDRAW amount COIN`.
- Every submitted or failed attempt is written to `withdrawalRequests` when the database is available.

## Binance docs used

- Withdraw endpoint: https://developers.binance.com/docs/wallet/capital/withdraw
- Signed request security: https://developers.binance.com/docs/binance-spot-api-docs/rest-api/request-security
