import crypto from 'crypto';

export const WEBHOOK_SECRET = 'test-webhook-secret';

export function createValidSignature(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload, 'utf8').digest('hex');
}

export const SAMPLE_WEBHOOK_PAYLOAD = JSON.stringify({
  event: 'form990n.status_changed',
  submissionId: 'sub-001',
  recordId: 'rec-001',
  status: 'Accepted',
  timestamp: '2024-01-15T12:00:00Z',
});
