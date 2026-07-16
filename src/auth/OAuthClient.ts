import jwt from 'jsonwebtoken';
import { HttpClient } from '../http/HttpClient';
import { AuthError } from '../errors';
import type {
  Tax990ClientConfig,
  GenerateJWSResponse,
  Tax990TokenResponse,
} from '../types/auth.types';

/**
 * Implements the Tax990 two-step token flow from ANALYSIS.md:
 *   1. Sign a JWS locally using HS256 (clientSecret, claims: iss/sub/aud/iat)
 *   2. GET /Auth/GetTax990Token with `authentication: <JWS>` → AccessToken (RS256, 3600s)
 *
 * Alternatively, call POST /Auth/GenerateJWS to get the JWS from the server.
 */
export class OAuthClient {
  private readonly http: HttpClient;
  private readonly config: Tax990ClientConfig;

  constructor(http: HttpClient, config: Tax990ClientConfig) {
    this.http = http;
    this.config = config;
  }

  /**
   * Signs a JWS locally (HS256) using the clientSecret.
   * Claims per ANALYSIS.md: iss=clientId, sub=clientId, aud=userToken, iat=now
   */
  signJWSLocally(): string {
    const { clientId, clientSecret, userToken } = this.config;
    const payload = {
      iss: clientId,
      sub: clientId,
      aud: userToken,
      iat: Math.floor(Date.now() / 1000),
    };
    return jwt.sign(payload, clientSecret, { algorithm: 'HS256', noTimestamp: false });
  }

  /**
   * Calls POST /Auth/GenerateJWS to have the server produce the JWS.
   * Use this when you do not have the clientSecret available client-side.
   */
  async generateJWSFromServer(): Promise<string> {
    const { clientId, clientSecret, userToken } = this.config;
    const res = await this.http.post<GenerateJWSResponse>('/Auth/GenerateJWS', {
      ClientId: clientId,
      ClientSecretId: clientSecret,
      UserToken: userToken,
    });
    return res.response.JWSToken;
  }

  /**
   * Full token acquisition:
   *   1. Sign JWS locally with HS256
   *   2. GET /Auth/GetTax990Token → AccessToken (expires in 3600s)
   */
  async getAccessToken(): Promise<{ accessToken: string; expiresIn: number }> {
    const jws = this.signJWSLocally();

    const res = await this.http.get<Tax990TokenResponse>(
      '/Auth/GetTax990Token',
      undefined,
      { authentication: jws },
    );

    if (res.response.Errors) {
      throw new AuthError(res.response.Errors.ErrorMessage);
    }

    return {
      accessToken: res.response.AccessToken,
      expiresIn: res.response.ExpiresIn ?? 3600,
    };
  }
}
