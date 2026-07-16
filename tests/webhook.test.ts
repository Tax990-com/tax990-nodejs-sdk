import { verifyWebhookSignature } from '../src/utils/WebhookVerifier';
import { Webhook } from '../src/resources/Webhook';
import {
  webhookSecret,
  webhookPayload,
  computeSignature,
} from './fixtures/webhook.fixtures';

describe('verifyWebhookSignature', () => {
  it('returns true for a valid HMAC-SHA256 signature', () => {
    const signature = computeSignature(webhookPayload, webhookSecret);
    expect(
      verifyWebhookSignature({
        secret: webhookSecret,
        payload: webhookPayload,
        signature,
      }),
    ).toBe(true);
  });

  it('returns false for a tampered payload', () => {
    const signature = computeSignature(webhookPayload, webhookSecret);
    const tampered = webhookPayload.replace('accepted', 'rejected');
    expect(
      verifyWebhookSignature({
        secret: webhookSecret,
        payload: tampered,
        signature,
      }),
    ).toBe(false);
  });

  it('returns false for a wrong secret', () => {
    const signature = computeSignature(webhookPayload, webhookSecret);
    expect(
      verifyWebhookSignature({
        secret: 'wrong-secret',
        payload: webhookPayload,
        signature,
      }),
    ).toBe(false);
  });

  it('returns false for mismatched lengths', () => {
    expect(
      verifyWebhookSignature({
        secret: webhookSecret,
        payload: webhookPayload,
        signature: 'short',
      }),
    ).toBe(false);
  });
});

describe('Webhook resource (stub)', () => {
  const webhookResource = new Webhook();

  it('register() throws not-implemented error', () => {
    expect(() => webhookResource.register({})).toThrow(
      'Webhook management endpoints are not available',
    );
  });

  it('list() throws not-implemented error', () => {
    expect(() => webhookResource.list()).toThrow(
      'Webhook management endpoints are not available',
    );
  });

  it('delete() throws not-implemented error', () => {
    expect(() => webhookResource.delete('id')).toThrow(
      'Webhook management endpoints are not available',
    );
  });
});
