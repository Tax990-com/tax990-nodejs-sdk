/**
 * Example: List organizations (Business records) for a given submission.
 *
 * Organization data in the Tax990 API is embedded in Form990N filing records
 * per ANALYSIS.md. This example queries filings and extracts the Business fields.
 *
 * Run:
 *   TAX990_CLIENT_ID=xxx TAX990_CLIENT_SECRET=xxx TAX990_USER_TOKEN=xxx \
 *   SUBMISSION_ID=your-submission-id \
 *   npx ts-node examples/list-organizations.ts
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

  const result = await client.organizations.list({ SubmissionId: SUBMISSION_ID });

  console.log(`SubmissionId: ${result.SubmissionId}`);
  console.log(`Total records: ${result.Form990NRecords?.SuccessRecords?.length ?? 0}`);

  const records = result.Form990NRecords?.SuccessRecords ?? [];
  for (const rec of records) {
    const biz = rec.Business;
    console.log('\n---');
    console.log(`  BusinessId:  ${rec.BusinessId}`);
    console.log(`  Name:        ${biz.BusinessNm ?? '(none)'}`);
    console.log(`  EIN:         ${biz.EIN ?? '(none)'}`);
    console.log(`  Email:       ${biz.EmailAddress ?? '(none)'}`);
    console.log(`  Status:      ${rec.RecordStatus}`);

    if (biz.USAddress) {
      const a = biz.USAddress;
      console.log(`  Address:     ${a.Address1}, ${a.City}, ${a.State} ${a.ZipCd}`);
    } else if (biz.ForeignAddress) {
      const a = biz.ForeignAddress;
      console.log(`  Address:     ${a.Address1}, ${a.City}, ${a.Country}`);
    }
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
