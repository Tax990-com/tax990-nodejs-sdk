import { Tax990Client } from '../src';

async function main() {
  const client = new Tax990Client({
    clientId: process.env.TAX990_CLIENT_ID!,
    clientSecret: process.env.TAX990_CLIENT_SECRET!,
    userToken: process.env.TAX990_USER_TOKEN!,
    environment: 'sandbox',
  });

  const result = await client.form990n.create({
    Form990NRecords: [
      {
        Business: {
          BusinessId: null,
          BusinessNm: 'Example Nonprofit',
          EIN: '123456789',
          DBANm: null,
          InCareOfNm: null,
          EmailAddress: 'contact@example.org',
          Phone: '5551234567',
          IsForeign: false,
          USAddress: {
            Address1: '123 Main St',
            Address2: null,
            City: 'Springfield',
            State: 'IL',
            ZipCd: '62701',
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
          WebsiteAddress: 'https://example.org',
          PrincipalOfficer: {
            OfficerNm: 'Jane Doe',
            IsForeign: false,
            USAddress: {
              Address1: '456 Oak Ave',
              Address2: null,
              City: 'Springfield',
              State: 'IL',
              ZipCd: '62701',
            },
            ForeignAddress: null,
          },
        },
      },
    ],
  });

  console.log('SubmissionId:', result.SubmissionId);
  console.log('Records:', JSON.stringify(result.Form990NRecords, null, 2));
}

main().catch(console.error);
