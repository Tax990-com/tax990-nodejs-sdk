// API key management endpoints are not documented in the Tax990 Public API (ANALYSIS.md).
// Authentication uses the JWS/JWT flow — see OAuthClient.
// This resource is a stub reserved for future use.

export class ApiKeys {
  create(_options: unknown): never {
    throw new Error(
      'API key management endpoints are not available in the Tax990 Public API. ' +
        'See OAuthClient for the documented authentication flow.',
    );
  }

  list(): never {
    throw new Error(
      'API key management endpoints are not available in the Tax990 Public API.',
    );
  }

  revoke(_id: string): never {
    throw new Error(
      'API key management endpoints are not available in the Tax990 Public API.',
    );
  }
}
