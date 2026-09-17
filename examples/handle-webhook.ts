import { verifyWebhookSignature } from '../src';

const WEBHOOK_SECRET = process.env.TAX990_WEBHOOK_SECRET || 'your-webhook-secret';

function handleWebhook(rawBody: string, signatureHeader: string) {
  const isValid = verifyWebhookSignature({
    secret: WEBHOOK_SECRET,
    payload: rawBody,
    signature: signatureHeader,
  });

  if (!isValid) {
    console.error('Invalid webhook signature — rejecting');
    return;
  }

  const event = JSON.parse(rawBody);
  console.log('Verified webhook event:', event);
}

const samplePayload = JSON.stringify({
  event: 'form990n.status_changed',
  submissionId: 'sub-001',
  status: 'Accepted',
});

const crypto = require('crypto');
const signature = crypto.createHmac('sha256', WEBHOOK_SECRET).update(samplePayload).digest('hex');

handleWebhook(samplePayload, signature);
