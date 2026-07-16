# @tax990/sdk-node

Official Node.js SDK for the Tax990 Public API.

## Installation

```bash
npm install @tax990/sdk-node
```

## Quick Start

```typescript
import { Tax990Client } from '@tax990/sdk-node';

const client = new Tax990Client({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret_id',
  userToken: 'your_user_token',
  environment: 'production', // or 'sandbox'
});

// Submit a Form 990-N filing
const result = await client.form990n.submit({
  Form990NRecords: [{
    Business: {
      BusinessId: null,
      BusinessNm: 'Example Nonprofit',
      EIN: '12-3456789',
      DBANm: null,
      InCareOfNm: null,
      EmailAddress: 'contact@example.org',
      Phone: '5125550100',
      IsForeign: false,
      USAddress: { Address1: '100 Main St', Address2: null, City: 'Austin', State: 'TX', ZipCd: '78701' },
      ForeignAddress: null,
    },
    Form990N: {
      SequenceId: '1',
      RecordId: null,
      TaxYr: '2024',
      TaxPeriodBeginDt: '2024-01-01',
      TaxPeriodEndDt: '2024-12-31',
      IsGrossReceiptsUnder50K: true,
      IsOrganizationTerminated: false,
      WebsiteAddress: null,
      PrincipalOfficer: {
        OfficerNm: 'Jane Smith',
        IsForeign: false,
        USAddress: { Address1: '100 Main St', Address2: null, City: 'Austin', State: 'TX', ZipCd: '78701' },
        ForeignAddress: null,
      },
    },
  }],
});

console.log('SubmissionId:', result.SubmissionId);
```

## Configuration

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `clientId` | string | Yes | Your Client ID (`ClientId` in API) |
| `clientSecret` | string | Yes | Your Client Secret (`ClientSecretId` in API) |
| `userToken` | string | Yes | Your User Token (`UserToken` in API) |
| `environment` | `'production'` \| `'sandbox'` | No | Default: `'sandbox'` |
| `apiUrl` | string | No | Override Form990N API base URL |
| `oauthUrl` | string | No | Override OAuth API base URL |
| `timeout` | number | No | Request timeout in ms. Default: 30000 |

## Authentication

Authentication follows the two-step flow documented in the Tax990 OAuth API:

1. A JWS is signed locally using **HS256** with your `clientSecret`
   - Claims: `iss`=clientId, `sub`=clientId, `aud`=userToken, `iat`=now
2. The JWS is sent to `GET /Auth/GetTax990Token` (header: `authentication`)
3. The server returns an **RS256** access token (expires in 3600s)

The `TokenManager` handles caching and auto-renewal transparently.

## API Reference

### `client.form990n`

| Method | Description |
|--------|-------------|
| `submit(payload, idempotencyKey?)` | Create filing records (alias for `create`) |
| `create(payload, idempotencyKey?)` | `POST /v1/form990n/create` |
| `update(payload)` | `POST /v1/form990n/update` |
| `get({ SubmissionId, RecordId? })` | `GET /v1/form990n/get` |
| `list({ SubmissionId?, BusinessId? })` | `GET /v1/form990n/list` |
| `delete({ SubmissionId, RecordId? })` | `DELETE /v1/form990n/delete` |
| `validate({ SubmissionId, RecordIds })` | `GET /v1/form990n/validate` |
| `transmit({ SubmissionId, RecordIds? })` | `POST /v1/form990n/transmit` |
| `getPDF({ SubmissionId, RecordIds? })` | `GET /v1/form990n/getPDF` |
| `status({ SubmissionId, RecordIds? })` | `GET /v1/form990n/status` |

### `client.organizations`

Queries organization (Business) data from Form990N records.

| Method | Description |
|--------|-------------|
| `list({ SubmissionId?, BusinessId? })` | List organizations via form990n/list |
| `get({ SubmissionId, RecordId? })` | Get organization via form990n/get |

### `client.filingStatus`

| Method | Description |
|--------|-------------|
| `get({ SubmissionId, RecordIds? })` | `GET /v1/form990n/status` |

### `client.webhooks` and `client.apiKeys`

These resources are **not documented** in the Tax990 Public API. Their methods throw `Error` to make that explicit.

## Error Handling

```typescript
import { AuthError, ValidationError, NotFoundError, RateLimitError } from '@tax990/sdk-node';

try {
  await client.form990n.submit(payload);
} catch (err) {
  if (err instanceof ValidationError) {
    console.error('Validation errors:', err.errors);
  } else if (err instanceof AuthError) {
    console.error('Authentication failed:', err.message);
  } else if (err instanceof NotFoundError) {
    console.error('Not found:', err.message);
  } else if (err instanceof RateLimitError) {
    console.error('Rate limited, retry later');
  }
}
```

## Utilities

```typescript
import { validateEin, formatEin, verifyWebhookSignature } from '@tax990/sdk-node';

validateEin('12-3456789');      // true
formatEin('123456789');         // '12-3456789'

verifyWebhookSignature({ secret, payload, signature }); // boolean
```

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm test            # jest
npm run build       # tsc
```
