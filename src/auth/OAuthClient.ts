import jwt from 'jsonwebtoken';
import { HttpClient } from '../http/HttpClient';
import { AuthError } from '../errors';
import type {
  Tax990ClientConfig,
  GenerateJWSResponse,
  Tax990TokenResponse,
} from '../types/auth.types';

export class OAuthClient {
  private readonly http: HttpClient;
  private readonly config: Tax990ClientConfig;

  constructor(http: HttpClient, config: Tax990ClientConfig) {
    this.http = http;
    this.config = config;
  }

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

  async generateJWSFromServer(): Promise<string> {
    const { clientId, clientSecret, userToken } = this.config;
    const res = await this.http.post<GenerateJWSResponse>('/Auth/GenerateJWS', {
      ClientId: clientId,
      ClientSecretId: clientSecret,
      UserToken: userToken,
    });
    return res.response.JWSToken;
  }

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
