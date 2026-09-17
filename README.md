# Tax990 Node.js SDK 2.0

## Overview

The Tax990 Node.js SDK 2.0.x is a TypeScript/Node.js integration package for the Tax990 Public
API. It enables businesses and software providers to integrate IRS Form 990-N e-filing directly
into their applications, without hand-rolling OAuth, request signing, or response parsing.

This SDK provides:

- **`Tax990Client`** — a single entry point exposing typed resources for Form 990-N filing,
  utility ID lookups, and nonprofit organization lookups
- **Automatic OAuth 2.0 token management** — signs and refreshes access tokens transparently
  between calls
- **Full TypeScript types** — request/response shapes, structured errors, everything typed
- **Zero required dependencies beyond `axios`, `jsonwebtoken`, and `uuid`**

A separate React UI ([`../frontend`](../frontend)) is included in this repository as a shared
playground for exercising any of the four language SDKs side by side —
[`../frontend/server/index.ts`](../frontend/server/index.ts) is a working Express bridge server
built on this exact SDK. See [`../UI_INTEGRATION.md`](../UI_INTEGRATION.md) for the architecture
and [`../TESTING.md`](../TESTING.md) for the full test walkthrough.

🔗 Full API Reference: [developer.tax990.com](https://developer.tax990.com)

## Project Structure

```
nodejs/
├── src/
│   ├── auth/               # OAuthClient, TokenManager
│   ├── errors/              # Tax990Error and subclasses
│   ├── http/                 # HttpClient (axios wrapper, retry, bearer injection)
│   ├── resources/            # Form990N, Utility, Nonprofits, Organization, FilingStatus, Webhook
│   ├── types/                 # Request/response TypeScript interfaces
│   ├── utils/                  # EIN validation, webhook signature verification
│   └── index.ts                # Tax990Client — package entry point
├── examples/
│   ├── submit-990n.ts
│   ├── check-filing-status.ts
│   ├── list-organizations.ts
│   └── handle-webhook.ts
├── tests/
│   ├── auth.test.ts
│   ├── form990n.test.ts
│   ├── webhook.test.ts
│   └── fixtures/
├── jest.config.ts
└── package.json
```

## Installation

```bash
npm install @tax990/sdk-node
```

Or, to build from source inside this repository:

```bash
cd nodejs
npm install
npm run build
```

## Quick Start

```ts
import { Tax990Client } from '@tax990/sdk-node';

const client = new Tax990Client({
  clientId: process.env.TAX990_CLIENT_ID!,
  clientSecret: process.env.TAX990_CLIENT_SECRET!,
  userToken: process.env.TAX990_USER_TOKEN!,
  // API and OAuth URLs are read from TAX990_API_URL / TAX990_OAUTH_URL env vars
});

const ping = await client.utility.ping();
console.log(ping);
```

## Available API Modules

### Authentication

Handled automatically. `Tax990Client` signs a JWS locally with `clientSecret`, exchanges it for an
access token against the OAuth endpoint, and caches/refreshes it before expiry — no manual token
handling required.

### Form 990-N (`client.form990n`)

Create, validate, and transmit IRS Form 990-N e-Postcard filings.

| Method | Endpoint | Description |
|---|---|---|
| `create(payload, idempotencyKey?)` | `POST /v1/form990n/create` | Create and save a new Form 990-N filing |
| `submit(payload, idempotencyKey?)` | `POST /v1/form990n/create` | Alias for `create` |
| `update(payload)` | `POST /v1/form990n/update` | Update an existing filing |
| `get(params)` | `GET /v1/form990n/get` | Retrieve a saved filing by SubmissionId |
| `list(params)` | `GET /v1/form990n/list` | Paginated list of filings |
| `delete(params)` | `DELETE /v1/form990n/delete` | Delete an untransmitted filing |
| `validate(params)` | `GET /v1/form990n/validate` | Validate records before transmit |
| `transmit(payload)` | `POST /v1/form990n/transmit` | E-file to the IRS |
| `getPDF(params)` | `GET /v1/form990n/getPDF` | Download filing PDF copies |
| `status(params)` | `GET /v1/form990n/status` | Check IRS acknowledgement status |

**Key fields:** `TaxYr`, `TaxPeriodBeginDt`/`EndDt`, `IsGrossReceiptsUnder50K`,
`IsOrganizationTerminated`, `PrincipalOfficer`, `Business.USAddress`/`ForeignAddress`.

### Utility (`client.utility`)

Health checks and cross-reference ID lookups.

| Method | Endpoint | Description |
|---|---|---|
| `ping()` | `GET /v1/utility/ping` | Health check |
| `getAllSubmissionIds()` | `GET /v1/utility/getAllSubmissionId` | Get all submission IDs |
| `getSubmissionIdByBusinessId(params)` | `GET /v1/utility/getSubmissionIdByBusinessId` | Look up submission by business ID |
| `getSubmissionIdByRecordId(params)` | `GET /v1/utility/getSubmissionIdByRecordId` | Look up submission by record ID |
| `getRecordIds()` | `GET /v1/utility/getRecordIds` | Get all record IDs |
| `getRecordIdBySubmissionId(params)` | `GET /v1/utility/getRecordIdBySubmissionId` | Get records for a submission |
| `getRecordDetailBySubmissionId(params)` | `GET /v1/utility/getRecordDetailBySubmissionId` | Get record details for a submission |
| `getAllBusinessIds()` | `GET /v1/utility/getAllBusinessId` | Get all business IDs |
| `getBusinessIdBySubmissionId(params)` | `GET /v1/utility/getBusinessIdBySubmissionId` | Get business ID for a submission |

### Nonprofits (`client.nonprofits`)

| Method | Endpoint | Description |
|---|---|---|
| `getOrganizationDetailsByEIN(params)` | `GET /v1/nonprofits/getOrganizationDetailsByEIN` | Look up nonprofit organization details by EIN |

Also available: `client.organizations` (business-entity queries over the same Form 990-N data),
`client.filingStatus` (a status-only convenience wrapper), and `client.webhooks` (stub — webhook
endpoints are not yet live on the Public API).

## Environment Variables

Set these in `nodejs/.env` (loaded automatically via `dotenv`) or export them in your shell.

| Variable | Required | Description |
|---|---|---|
| `TAX990_CLIENT_ID` | ✅ | OAuth client identifier |
| `TAX990_CLIENT_SECRET` | ✅ | OAuth client secret, used to sign the JWS |
| `TAX990_USER_TOKEN` | ✅ | OAuth audience token for this client |
| `TAX990_API_URL` | ✅ | Public API base URL (e.g. `https://api.tax990.com`) |
| `TAX990_OAUTH_URL` | ✅ | OAuth API base URL (e.g. `https://oauth.tax990.com`) |

`Tax990ClientConfig.apiUrl` / `oauthUrl` can be passed directly to override the env vars at the
call site.

## Typical Workflow

1. **Instantiate** → `new Tax990Client(config)`
2. **Create a filing** → `client.form990n.create(payload)` → store the returned `SubmissionId`
3. **Validate (optional)** → `client.form990n.validate(...)` to catch errors before transmit
4. **Review a draft** → `client.form990n.getPDF(...)` for a pre-transmission preview
5. **Transmit** → `client.form990n.transmit(...)` to e-file with the IRS
6. **Track status** → `client.form990n.status(...)` for acknowledgement status
7. **Look up organizations** → `client.nonprofits.getOrganizationDetailsByEIN(...)` as needed

## Error Handling

All API errors extend `Tax990Error` (exported from the package root), carrying the response
`statusCode` and a structured `errors` array:

```ts
import { Tax990Error, ValidationError, AuthError } from '@tax990/sdk-node';

try {
  await client.form990n.create(payload);
} catch (err) {
  if (err instanceof ValidationError) {
    err.errors.forEach((e) => console.log(`[${e.Code}] ${e.Field}: ${e.Message}`));
  } else if (err instanceof AuthError) {
    console.log('Authentication failed:', err.message);
  } else if (err instanceof Tax990Error) {
    console.log(`API error (${err.statusCode}):`, err.message);
  }
}
```

## Testing

```bash
cd nodejs
npm install
npm test
```

## Documentation

🔗 [Tax990 Public API Docs](https://developer.tax990.com)

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+, TypeScript |
| HTTP | `axios` + `axios-retry` |
| Auth | OAuth 2.0 Bearer tokens, JWS (HS256) via `jsonwebtoken` |
| Tests | Jest, `ts-jest` |

## License

MIT — internal SDK for Tax990 Public API integration.
