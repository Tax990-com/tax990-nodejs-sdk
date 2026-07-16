import crypto from 'crypto';
import { WebhookVerifyOptions } from '../types/webhook.types';

// ANALYSIS.md does not document a webhook signing mechanism.
// This utility provides HMAC-SHA256 verification for potential
// webhook payloads using a shared secret.

export function verifyWebhookSignature(options: WebhookVerifyOptions): boolean {
  const { secret, payload, signature } = options;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
}
