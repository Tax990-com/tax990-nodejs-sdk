# Changelog

## 0.1.0 (2024-01-15)

### Added
- `Tax990Client` entry point with `form990n`, `organizations`, `filingStatus`, `webhooks`, `apiKeys` resources
- `OAuthClient` — two-step JWS/JWT token flow (HS256 local signing → RS256 access token)
- `TokenManager` — transparent token caching and auto-refresh with 30s expiry buffer
- `Form990N` resource — all 9 documented endpoints: create, update, get, list, delete, validate, transmit, getPDF, status
- `Organization` resource — surfaces Business data via form990n list/get
- `FilingStatus` resource — wraps `/v1/form990n/status`
- `Webhook` and `ApiKeys` resources — explicit stubs (endpoints not in API)
- `HttpClient` — axios wrapper with retry (3x exponential), timeout, correlation ID injection
- Error classes: `Tax990Error`, `AuthError`, `ValidationError`, `RateLimitError`, `NotFoundError`
- Utilities: `validateEin`, `formatEin`, `verifyWebhookSignature`
- Full TypeScript types from ANALYSIS.md: `USAddress`, `ForeignAddress`, `Business`, `PrincipalOfficer`, `Form990NData`, `ApiResponse`, all record types, `FilingStatusId`, `FormType` enums
