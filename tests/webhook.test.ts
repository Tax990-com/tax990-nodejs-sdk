import { verifyWebhookSignature } from '../src/utils/WebhookVerifier';
import { WEBHOOK_SECRET, SAMPLE_WEBHOOK_PAYLOAD, createValidSignature } from './fixtures/webhook.fixtures';

describe('WebhookVerifier', () => {
  it('should return true for a valid signature', () => {
    const signature = createValidSignature(SAMPLE_WEBHOOK_PAYLOAD, WEBHOOK_SECRET);
    expect(
      verifyWebhookSignature({
        secret: WEBHOOK_SECRET,
        payload: SAMPLE_WEBHOOK_PAYLOAD,
        signature,
      }),
    ).toBe(true);
  });

  it('should return false for an invalid signature', () => {
    expect(
      verifyWebhookSignature({
        secret: WEBHOOK_SECRET,
        payload: SAMPLE_WEBHOOK_PAYLOAD,
        signature: 'invalid-signature-hex'.padEnd(64, '0'),
      }),
    ).toBe(false);
  });

  it('should return false for a tampered payload', () => {
    const signature = createValidSignature(SAMPLE_WEBHOOK_PAYLOAD, WEBHOOK_SECRET);
    expect(
      verifyWebhookSignature({
        secret: WEBHOOK_SECRET,
        payload: SAMPLE_WEBHOOK_PAYLOAD + 'tampered',
        signature,
      }),
    ).toBe(false);
  });

  it('should return false for a wrong secret', () => {
    const signature = createValidSignature(SAMPLE_WEBHOOK_PAYLOAD, WEBHOOK_SECRET);
    expect(
      verifyWebhookSignature({
        secret: 'wrong-secret',
        payload: SAMPLE_WEBHOOK_PAYLOAD,
        signature,
      }),
    ).toBe(false);
  });
});
