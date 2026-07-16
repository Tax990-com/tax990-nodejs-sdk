import { HttpClient } from './http/HttpClient';
import { OAuthClient } from './auth/OAuthClient';
import { TokenManager } from './auth/TokenManager';
import { Form990N } from './resources/Form990N';
import { Organization } from './resources/Organization';
import { FilingStatus } from './resources/FilingStatus';
import { Webhook } from './resources/Webhook';
import { ApiKeys } from './resources/ApiKeys';
import type { Tax990ClientConfig } from './types/auth.types';

export type { Tax990ClientConfig };
export * from './types';
export * from './errors';
export * from './utils';

const ENVIRONMENT_URLS: Record<'production' | 'sandbox', { apiUrl: string; oauthUrl: string }> = {
  production: {
    apiUrl: 'https://api.tax990.com',
    oauthUrl: 'https://oauth.tax990.com',
  },
  sandbox: {
    apiUrl: 'http://localhost:9005',
    oauthUrl: 'http://localhost:4000',
  },
};

export class Tax990Client {
  readonly form990n: Form990N;
  readonly organizations: Organization;
  readonly filingStatus: FilingStatus;
  readonly webhooks: Webhook;
  readonly apiKeys: ApiKeys;

  constructor(config: Tax990ClientConfig) {
    const env = config.environment ?? 'sandbox';
    const defaults = ENVIRONMENT_URLS[env];

    const oauthUrl = config.oauthUrl ?? defaults.oauthUrl;
    const apiUrl = config.apiUrl ?? defaults.apiUrl;

    // OAuth HTTP client (no bearer token — used for getting the token)
    const oauthHttp = new HttpClient({
      baseUrl: oauthUrl,
      timeout: config.timeout,
    });

    const oauthClient = new OAuthClient(oauthHttp, config);
    const tokenManager = new TokenManager(oauthClient);

    // API HTTP client (bearer token auto-attached)
    const apiHttp = new HttpClient({
      baseUrl: apiUrl,
      timeout: config.timeout,
      getToken: () => tokenManager.getToken(),
    });

    this.form990n = new Form990N(apiHttp);
    this.organizations = new Organization(apiHttp);
    this.filingStatus = new FilingStatus(apiHttp);
    this.webhooks = new Webhook();
    this.apiKeys = new ApiKeys();
  }
}
