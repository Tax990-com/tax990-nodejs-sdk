/**
 * Example: Verify an incoming webhook payload using HMAC-SHA256.
 *
 * NOTE: Webhook endpoints are not documented in the Tax990 Public API (ANALYSIS.md).
 * This example shows how to use the verifyWebhookSignature utility if
 * webhooks are added in the future.
 *
 * Run:
 *   WEBHOOK_SECRET=your-shared-secret npx ts-node examples/handle-webhook.ts
 */

import crypto from 'crypto';
import { verifyWebhookSignature } from '../src/utils';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? 'dev-secret-key';

// Simulate an incoming webhook payload
const incomingPayload = JSON.stringify({
  event: 'filing.accepted',
  submissionId: 'submission-uuid-456',
  recordId: 'record-uuid-789',
  timestamp: new Date().toISOString(),
});

// Simulate the signature the server would attach
const incomingSignature = crypto
  .createHmac('sha256', WEBHOOK_SECRET)
  .update(incomingPayload, 'utf8')
  .digest('hex');

function handleWebhook(payload: string, signature: string, secret: string) {
  const isValid = verifyWebhookSignature({ payload, signature, secret });

  if (!isValid) {
    console.error('Webhook signature verification FAILED — rejecting payload.');
    return;
  }

  const event = JSON.parse(payload) as {
    event: string;
    submissionId: string;
    recordId: string;
    timestamp: string;
  };

  console.log('Webhook verified successfully.');
  console.log(`  Event:        ${event.event}`);
  console.log(`  SubmissionId: ${event.submissionId}`);
  console.log(`  RecordId:     ${event.recordId}`);
  console.log(`  Timestamp:    ${event.timestamp}`);
}

handleWebhook(incomingPayload, incomingSignature, WEBHOOK_SECRET);
