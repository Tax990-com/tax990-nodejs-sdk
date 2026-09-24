# tax990-nodejs-sdk

Official Node.js / TypeScript SDK for the Tax990 Public API — IRS Form 990-N e-filing, utility
lookups, and nonprofit organization search.

🔗 API Reference: [developer.tax990.com](https://developer.tax990.com)

## Installation

```bash
npm install @tax990/sdk-node
```

Or build from source:

```bash
npm install
npm run build
```

## Quick start

```ts
import { Tax990Client } from '@tax990/sdk-node';

const client = new Tax990Client({
  clientId: process.env.TAX990_CLIENT_ID!,
  clientSecret: process.env.TAX990_CLIENT_SECRET!,
  userToken: process.env.TAX990_USER_TOKEN!,
});

const ping = await client.utility.ping();
console.log(ping);
```

## Environment variables

Create a `.env` file in the repo root:

```
TAX990_CLIENT_ID=...
TAX990_CLIENT_SECRET=...
TAX990_USER_TOKEN=...
TAX990_API_URL=https://api-sandbox.tax990.com
TAX990_OAUTH_URL=https://oauth-sandbox.tax990.com
```

| Variable | Required | Description |
|---|---|---|
| `TAX990_CLIENT_ID` | ✅ | OAuth client identifier |
| `TAX990_CLIENT_SECRET` | ✅ | OAuth client secret, used to sign the JWS |
| `TAX990_USER_TOKEN` | ✅ | OAuth audience token for this client |
| `TAX990_API_URL` | ✅ | API base URL — production: `https://api.tax990.com`, sandbox: `https://api-sandbox.tax990.com` |
| `TAX990_OAUTH_URL` | ✅ | OAuth base URL — production: `https://oauth.tax990.com`, sandbox: `https://oauth-sandbox.tax990.com` |

## Available modules

### Form 990-N (`client.form990n`)

| Method | Endpoint | Description |
|---|---|---|
| `create(payload, idempotencyKey?)` | `POST /v1/form990n/create` | Create a new filing |
| `update(payload)` | `POST /v1/form990n/update` | Update an existing filing |
| `get(params)` | `GET /v1/form990n/get` | Retrieve a filing by SubmissionId |
| `list(params)` | `GET /v1/form990n/list` | List filings |
| `delete(params)` | `DELETE /v1/form990n/delete` | Delete an untransmitted filing |
| `validate(params)` | `GET /v1/form990n/validate` | Validate before transmit |
| `transmit(payload)` | `POST /v1/form990n/transmit` | E-file to the IRS |
| `getPDF(params)` | `GET /v1/form990n/getPDF` | Download PDF copies |
| `status(params)` | `GET /v1/form990n/status` | Check IRS acknowledgement status |

### Utility (`client.utility`)

| Method | Endpoint | Description |
|---|---|---|
| `ping()` | `GET /v1/utility/ping` | Health check |
| `getAllSubmissionIds()` | `GET /v1/utility/getAllSubmissionId` | All submission IDs |
| `getSubmissionIdByBusinessId(params)` | `GET /v1/utility/getSubmissionIdByBusinessId` | Submission by business ID |
| `getSubmissionIdByRecordId(params)` | `GET /v1/utility/getSubmissionIdByRecordId` | Submission by record ID |
| `getRecordIds()` | `GET /v1/utility/getRecordIds` | All record IDs |
| `getRecordIdBySubmissionId(params)` | `GET /v1/utility/getRecordIdBySubmissionId` | Records for a submission |
| `getRecordDetailBySubmissionId(params)` | `GET /v1/utility/getRecordDetailBySubmissionId` | Record details |
| `getAllBusinessIds()` | `GET /v1/utility/getAllBusinessId` | All business IDs |
| `getBusinessIdBySubmissionId(params)` | `GET /v1/utility/getBusinessIdBySubmissionId` | Business ID for a submission |

### Nonprofits (`client.nonprofits`)

| Method | Endpoint | Description |
|---|---|---|
| `getOrganizationDetailsByEIN(params)` | `GET /v1/nonprofits/getOrganizationDetailsByEIN` | Nonprofit details by EIN |

Also available: `client.organizations`, `client.filingStatus`.

## Typical workflow

1. `new Tax990Client(config)` — instantiate
2. `client.form990n.create(payload)` → store the returned `SubmissionId`
3. `client.form990n.validate(...)` — catch errors before transmit (optional)
4. `client.form990n.getPDF(...)` — review the draft PDF (optional)
5. `client.form990n.transmit(...)` — e-file to the IRS
6. `client.form990n.status(...)` — poll for IRS acknowledgement

## Error handling

```ts
import { Tax990Error, ValidationError, AuthError } from '@tax990/sdk-node';

try {
  await client.form990n.create(payload);
} catch (err) {
  if (err instanceof ValidationError) {
    err.errors.forEach((e) => console.log(`[${e.Code}] ${e.Field}: ${e.Message}`));
  } else if (err instanceof AuthError) {
    console.log('Auth failed:', err.message);
  } else if (err instanceof Tax990Error) {
    console.log(`API error (${err.statusCode}):`, err.message);
  }
}
```

## Running tests

```bash
npm install
npm test
```

## Bridge server (for use with tax990-ui-sdk)

The `server/` directory contains an Express bridge that exposes all SDK methods as HTTP endpoints,
so the `tax990-ui-sdk` React app can exercise this SDK through its UI.

```bash
# install deps first
npm install

# start bridge on http://localhost:4100
npm run server
```

Then in `tax990-ui-sdk`, set `VITE_BRIDGE_URL=http://localhost:4100` and run `npm run dev`.

The bridge reads the same `.env` credentials as the SDK. Add `BRIDGE_PORT=xxxx` to `.env` to run
on a different port.

## Project structure

```
tax990-nodejs-sdk/
├── src/
│   ├── auth/          OAuthClient, TokenManager
│   ├── errors/        Tax990Error and subclasses
│   ├── http/          HttpClient (axios wrapper, retry, bearer injection)
│   ├── resources/     Form990N, Utility, Nonprofits, Organization, FilingStatus
│   ├── types/         Request/response TypeScript interfaces
│   ├── utils/         EIN validation, webhook signature verification
│   └── index.ts       Tax990Client — package entry point
├── server/
│   └── index.ts       Express bridge server for tax990-ui-sdk
├── examples/
├── tests/
└── package.json
```

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+, TypeScript |
| HTTP | `axios` + `axios-retry` |
| Auth | OAuth 2.0, JWS (HS256) via `jsonwebtoken` |
| Tests | Jest, `ts-jest` |

## License

MIT
