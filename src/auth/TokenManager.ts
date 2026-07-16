import { OAuthClient } from './OAuthClient';
import type { StoredToken } from '../types/auth.types';

/** Buffer in ms before expiry to trigger a refresh (30 seconds) */
const EXPIRY_BUFFER_MS = 30_000;

/**
 * Holds the current access token and refreshes it automatically
 * before it expires. Token expiry is 3600s per ANALYSIS.md.
 */
export class TokenManager {
  private token: StoredToken | null = null;
  private refreshPromise: Promise<StoredToken> | null = null;

  constructor(private readonly oauthClient: OAuthClient) {}

  async getToken(): Promise<string> {
    if (this.token && !this.isExpired(this.token)) {
      return this.token.accessToken;
    }
    return (await this.refresh()).accessToken;
  }

  private isExpired(token: StoredToken): boolean {
    return Date.now() >= token.expiresAt - EXPIRY_BUFFER_MS;
  }

  private async refresh(): Promise<StoredToken> {
    // Deduplicate concurrent refresh calls
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this.oauthClient
      .getAccessToken()
      .then(({ accessToken, expiresIn }) => {
        const stored: StoredToken = {
          accessToken,
          expiresAt: Date.now() + expiresIn * 1000,
        };
        this.token = stored;
        return stored;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  /** Force-clear the cached token (useful in tests) */
  clearToken(): void {
    this.token = null;
  }
}
