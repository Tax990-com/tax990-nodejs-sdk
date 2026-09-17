import { Tax990Client } from '../src';

async function main() {
  const client = new Tax990Client({
    clientId: process.env.TAX990_CLIENT_ID!,
    clientSecret: process.env.TAX990_CLIENT_SECRET!,
    userToken: process.env.TAX990_USER_TOKEN!,
    environment: 'sandbox',
  });

  const result = await client.filingStatus.get({
    SubmissionId: process.argv[2] || 'your-submission-id',
  });

  console.log('Filing Status:', JSON.stringify(result, null, 2));
}

main().catch(console.error);
