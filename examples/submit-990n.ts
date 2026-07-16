/**
 * Example: Submit a Form 990-N (e-Postcard) filing
 *
 * Run:
 *   TAX990_CLIENT_ID=xxx TAX990_CLIENT_SECRET=xxx TAX990_USER_TOKEN=xxx \
 *   npx ts-node examples/submit-990n.ts
 */

import { Tax990Client } from '../src';

const client = new Tax990Client({
  clientId: process.env.TAX990_CLIENT_ID ?? '',
  clientSecret: process.env.TAX990_CLIENT_SECRET ?? '',
  userToken: process.env.TAX990_USER_TOKEN ?? '',
  environment: (process.env.TAX990_ENVIRONMENT as 'production' | 'sandbox') ?? 'sandbox',
});

async function main() {
  const result = await client.form990n.submit({
    Form990NRecords: [
      {
        Business: {
          BusinessId: null,
          BusinessNm: 'Example Nonprofit Organization',
          EIN: '12-3456789',
          DBANm: null,
          InCareOfNm: null,
          EmailAddress: 'contact@example-nonprofit.org',
          Phone: '5125550100',
          IsForeign: false,
          USAddress: {
            Address1: '100 Congress Ave',
            Address2: 'Suite 200',
            City: 'Austin',
            State: 'TX',
            ZipCd: '78701',
          },
          ForeignAddress: null,
        },
        Form990N: {
          SequenceId: '1',
          RecordId: null,
          TaxYr: '2024',
          TaxPeriodBeginDt: '2024-01-01',
          TaxPeriodEndDt: '2024-12-31',
          IsGrossReceiptsUnder50K: true,
          IsOrganizationTerminated: false,
          WebsiteAddress: 'https://example-nonprofit.org',
          PrincipalOfficer: {
            OfficerNm: 'Jane Smith',
            IsForeign: false,
            USAddress: {
              Address1: '100 Congress Ave',
              Address2: null,
              City: 'Austin',
              State: 'TX',
              ZipCd: '78701',
            },
            ForeignAddress: null,
          },
        },
      },
    ],
  });

  console.log('Submission ID:', result.SubmissionId);
  console.log('Status:', result.StatusNm);

  const success = result.Form990NRecords?.SuccessRecords ?? [];
  const errors = result.Form990NRecords?.ErrorRecords ?? [];

  for (const rec of success) {
    console.log(`  ✓ Record ${rec.SequenceId}: ${rec.RecordStatus} — RecordId: ${rec.RecordId}`);
  }
  for (const rec of errors) {
    console.error(`  ✗ Record ${rec.SequenceId}: ${rec.Errors.map((e) => e.Message).join(', ')}`);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
