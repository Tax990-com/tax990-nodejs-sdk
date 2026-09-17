import { Tax990Client } from '../src';

async function main() {
  const client = new Tax990Client({
    clientId: process.env.TAX990_CLIENT_ID!,
    clientSecret: process.env.TAX990_CLIENT_SECRET!,
    userToken: process.env.TAX990_USER_TOKEN!,
    environment: 'sandbox',
  });

  const result = await client.nonprofits.getOrganizationDetailsByEIN({
    ein: process.argv[2] || '123456789',
  });

  console.log('Organization:', JSON.stringify(result, null, 2));
}

main().catch(console.error);
