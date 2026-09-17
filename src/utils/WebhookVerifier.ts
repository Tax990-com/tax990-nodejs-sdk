import crypto from 'crypto';
import { WebhookVerifyOptions } from '../types/webhook.types';

export function verifyWebhookSignature(options: WebhookVerifyOptions): boolean {
  const { secret, payload, signature } = options;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(expected, 'utf8'));
}
