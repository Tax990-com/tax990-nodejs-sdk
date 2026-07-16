// Webhook endpoints are not documented in the Tax990 Public API (ANALYSIS.md).
// This file is reserved for future use.

export interface WebhookVerifyOptions {
  /** Shared secret used to verify the HMAC-SHA256 signature */
  secret: string;
  /** Raw request body as a string */
  payload: string;
  /** Signature value from the request header */
  signature: string;
}
