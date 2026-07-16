/**
 * Example: Check the filing status of submitted records
 *
 * Run:
 *   TAX990_CLIENT_ID=xxx TAX990_CLIENT_SECRET=xxx TAX990_USER_TOKEN=xxx \
 *   SUBMISSION_ID=your-submission-id \
 *   npx ts-node examples/check-filing-status.ts
 */

import { Tax990Client } from '../src';

const client = new Tax990Client({
  clientId: process.env.TAX990_CLIENT_ID ?? '',
  clientSecret: process.env.TAX990_CLIENT_SECRET ?? '',
  userToken: process.env.TAX990_USER_TOKEN ?? '',
  environment: (process.env.TAX990_ENVIRONMENT as 'production' | 'sandbox') ?? 'sandbox',
});

const SUBMISSION_ID = process.env.SUBMISSION_ID ?? '';

async function main() {
  if (!SUBMISSION_ID) {
    throw new Error('Set SUBMISSION_ID environment variable');
  }

  const result = await client.filingStatus.get({ SubmissionId: SUBMISSION_ID });

  console.log(`SubmissionId: ${result.SubmissionId}`);
  console.log(`Status: ${result.StatusNm} (${result.StatusCode})`);
  console.log(`CorrelationId: ${result.CorrelationId}`);

  const records = result.Form990NRecords?.SuccessRecords ?? [];
  if (records.length === 0) {
    console.log('No records found.');
    return;
  }

  for (const rec of records) {
    console.log(`  RecordId: ${rec.RecordId}  Status: ${rec.RecordStatus}  Updated: ${rec.UpdatedTs}`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
