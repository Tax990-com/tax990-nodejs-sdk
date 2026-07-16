import jwt from 'jsonwebtoken';
import { OAuthClient } from '../src/auth/OAuthClient';
import { TokenManager } from '../src/auth/TokenManager';
import { AuthError } from '../src/errors';
import { validConfig, tokenResponse, unauthorizedTokenResponse } from './fixtures/auth.fixtures';

// Mock axios and axios-retry so HttpClient can be constructed without real HTTP
jest.mock('axios', () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    defaults: { headers: {} },
  };
  return {
    create: jest.fn(() => mockInstance),
    isAxiosError: jest.fn(() => false),
    default: { create: jest.fn(() => mockInstance) },
    __mockInstance: mockInstance,
  };
});
jest.mock('axios-retry', () => jest.fn());

// eslint-disable-next-line @typescript-eslint/no-var-requires
const axiosMock = require('axios');
const getMockInstance = () => axiosMock.__mockInstance as {
  get: jest.Mock;
  post: jest.Mock;
  delete: jest.Mock;
};

import { HttpClient } from '../src/http/HttpClient';

function makeOAuthClient() {
  const http = new HttpClient({ baseUrl: 'http://localhost:4000' });
  const oauthClient = new OAuthClient(http, validConfig);
  return { oauthClient };
}

describe('OAuthClient', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('signJWSLocally', () => {
    it('produces a valid HS256 JWS with correct claims', () => {
      const { oauthClient } = makeOAuthClient();
      const jws = oauthClient.signJWSLocally();

      const decoded = jwt.verify(jws, validConfig.clientSecret, {
        algorithms: ['HS256'],
      }) as jwt.JwtPayload;

      expect(decoded.iss).toBe(validConfig.clientId);
      expect(decoded.sub).toBe(validConfig.clientId);
      expect(decoded.aud).toBe(validConfig.userToken);
      expect(typeof decoded.iat).toBe('number');
    });
  });

  describe('getAccessToken', () => {
    it('returns accessToken and expiresIn on success', async () => {
      getMockInstance().get.mockResolvedValueOnce({ data: tokenResponse });

      const { oauthClient } = makeOAuthClient();
      const result = await oauthClient.getAccessToken();

      expect(result.accessToken).toBe(tokenResponse.response.AccessToken);
      expect(result.expiresIn).toBe(3600);
    });

    it('throws AuthError when response contains Errors', async () => {
      getMockInstance().get.mockResolvedValueOnce({ data: unauthorizedTokenResponse });

      const { oauthClient } = makeOAuthClient();
      await expect(oauthClient.getAccessToken()).rejects.toThrow(AuthError);
    });
  });
});

describe('TokenManager', () => {
  it('returns a token and caches it', async () => {
    const getAccessToken = jest.fn().mockResolvedValue({
      accessToken: 'test-access-token',
      expiresIn: 3600,
    });
    const mockOAuthClient = { getAccessToken } as unknown as OAuthClient;
    const manager = new TokenManager(mockOAuthClient);

    const token1 = await manager.getToken();
    const token2 = await manager.getToken();

    expect(token1).toBe('test-access-token');
    expect(token2).toBe('test-access-token');
    expect(getAccessToken).toHaveBeenCalledTimes(1);
  });

  it('refreshes token after clearToken()', async () => {
    const getAccessToken = jest
      .fn()
      .mockResolvedValueOnce({ accessToken: 'token-1', expiresIn: 3600 })
      .mockResolvedValueOnce({ accessToken: 'token-2', expiresIn: 3600 });

    const mockOAuthClient = { getAccessToken } as unknown as OAuthClient;
    const manager = new TokenManager(mockOAuthClient);

    await manager.getToken();
    manager.clearToken();
    const token = await manager.getToken();

    expect(token).toBe('token-2');
    expect(getAccessToken).toHaveBeenCalledTimes(2);
  });

  it('deduplicates concurrent refresh calls', async () => {
    let resolveFirst!: (v: { accessToken: string; expiresIn: number }) => void;
    const firstCall = new Promise<{ accessToken: string; expiresIn: number }>(
      (r) => (resolveFirst = r),
    );

    const getAccessToken = jest.fn().mockReturnValueOnce(firstCall);
    const mockOAuthClient = { getAccessToken } as unknown as OAuthClient;
    const manager = new TokenManager(mockOAuthClient);

    const [p1, p2, p3] = [manager.getToken(), manager.getToken(), manager.getToken()];
    resolveFirst({ accessToken: 'concurrent-token', expiresIn: 3600 });

    const results = await Promise.all([p1, p2, p3]);
    expect(results).toEqual(['concurrent-token', 'concurrent-token', 'concurrent-token']);
    expect(getAccessToken).toHaveBeenCalledTimes(1);
  });
});
