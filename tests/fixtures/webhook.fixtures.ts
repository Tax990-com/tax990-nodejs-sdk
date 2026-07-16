export const webhookSecret = 'test-webhook-secret-key';

export const webhookPayload = JSON.stringify({
  event: 'filing.accepted',
  submissionId: 'submission-uuid-456',
  recordId: 'record-uuid-789',
  timestamp: '2024-01-15T12:00:00.000Z',
});

import crypto from 'crypto';

export function computeSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}
