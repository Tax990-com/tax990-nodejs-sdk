import { HttpClient } from './http/HttpClient';
import { OAuthClient } from './auth/OAuthClient';
import { TokenManager } from './auth/TokenManager';
import { Form990N } from './resources/Form990N';
import { Organization } from './resources/Organization';
import { FilingStatus } from './resources/FilingStatus';
import { Utility } from './resources/Utility';
import { Nonprofits } from './resources/Nonprofits';
import { Webhook } from './resources/Webhook';
import type { Tax990ClientConfig } from './types/auth.types';

export type { Tax990ClientConfig };
export * from './types';
export * from './errors';
export * from './utils';

export class Tax990Client {
  readonly form990n: Form990N;
  readonly organizations: Organization;
  readonly filingStatus: FilingStatus;
  readonly utility: Utility;
  readonly nonprofits: Nonprofits;
  readonly webhooks: Webhook;

  constructor(config: Tax990ClientConfig) {
    const apiUrl = config.apiUrl ?? process.env.TAX990_API_URL ?? '';
    const oauthUrl = config.oauthUrl ?? process.env.TAX990_OAUTH_URL ?? '';

    const oauthHttp = new HttpClient({
      baseUrl: oauthUrl,
      timeout: config.timeout,
    });

    const oauthClient = new OAuthClient(oauthHttp, config);
    const tokenManager = new TokenManager(oauthClient);

    const apiHttp = new HttpClient({
      baseUrl: apiUrl,
      timeout: config.timeout,
      getToken: () => tokenManager.getToken(),
    });

    this.form990n = new Form990N(apiHttp);
    this.organizations = new Organization(apiHttp);
    this.filingStatus = new FilingStatus(apiHttp);
    this.utility = new Utility(apiHttp);
    this.nonprofits = new Nonprofits(apiHttp);
    this.webhooks = new Webhook();
  }
}
