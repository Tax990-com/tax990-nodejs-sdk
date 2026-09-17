import { OAuthClient } from '../src/auth/OAuthClient';
import { TokenManager } from '../src/auth/TokenManager';
import { HttpClient } from '../src/http/HttpClient';
import { TEST_CONFIG, MOCK_TOKEN_RESPONSE, MOCK_JWS_RESPONSE } from './fixtures/auth.fixtures';

jest.mock('../src/http/HttpClient');

describe('OAuthClient', () => {
  let mockHttp: jest.Mocked<HttpClient>;
  let oauthClient: OAuthClient;

  beforeEach(() => {
    mockHttp = new HttpClient({ baseUrl: 'http://localhost:4000' }) as jest.Mocked<HttpClient>;
    oauthClient = new OAuthClient(mockHttp, TEST_CONFIG);
  });

  describe('signJWSLocally', () => {
    it('should return a valid JWS string with three dot-separated segments', () => {
      const jws = oauthClient.signJWSLocally();
      const segments = jws.split('.');
      expect(segments).toHaveLength(3);
    });

    it('should include correct claims in the payload', () => {
      const jws = oauthClient.signJWSLocally();
      const [, payloadSegment] = jws.split('.');
      const payload = JSON.parse(Buffer.from(payloadSegment, 'base64url').toString());
      expect(payload.iss).toBe(TEST_CONFIG.clientId);
      expect(payload.sub).toBe(TEST_CONFIG.clientId);
      expect(payload.aud).toBe(TEST_CONFIG.userToken);
      expect(payload.iat).toBeDefined();
    });
  });

  describe('generateJWSFromServer', () => {
    it('should call POST /Auth/GenerateJWS and return the JWS token', async () => {
      mockHttp.post = jest.fn().mockResolvedValue(MOCK_JWS_RESPONSE);
      const jws = await oauthClient.generateJWSFromServer();
      expect(jws).toBe(MOCK_JWS_RESPONSE.response.JWSToken);
      expect(mockHttp.post).toHaveBeenCalledWith('/Auth/GenerateJWS', {
        ClientId: TEST_CONFIG.clientId,
        ClientSecretId: TEST_CONFIG.clientSecret,
        UserToken: TEST_CONFIG.userToken,
      });
    });
  });

  describe('getAccessToken', () => {
    it('should sign JWS locally and exchange for access token', async () => {
      mockHttp.get = jest.fn().mockResolvedValue(MOCK_TOKEN_RESPONSE);
      const result = await oauthClient.getAccessToken();
      expect(result.accessToken).toBe(MOCK_TOKEN_RESPONSE.response.AccessToken);
      expect(result.expiresIn).toBe(MOCK_TOKEN_RESPONSE.response.ExpiresIn);
      expect(mockHttp.get).toHaveBeenCalledWith(
        '/Auth/GetTax990Token',
        undefined,
        expect.objectContaining({ authentication: expect.any(String) }),
      );
    });

    it('should throw AuthError when response contains errors', async () => {
      mockHttp.get = jest.fn().mockResolvedValue({
        ...MOCK_TOKEN_RESPONSE,
        response: {
          ...MOCK_TOKEN_RESPONSE.response,
          AccessToken: '',
          Errors: { ErrorCode: 'AUTH001', ErrorName: 'InvalidCredentials', ErrorMessage: 'Bad credentials' },
        },
      });
      await expect(oauthClient.getAccessToken()).rejects.toThrow('Bad credentials');
    });
  });
});

describe('TokenManager', () => {
  let mockOAuthClient: jest.Mocked<OAuthClient>;
  let tokenManager: TokenManager;

  beforeEach(() => {
    const mockHttp = new HttpClient({ baseUrl: 'http://localhost:4000' }) as jest.Mocked<HttpClient>;
    mockOAuthClient = new OAuthClient(mockHttp, TEST_CONFIG) as jest.Mocked<OAuthClient>;
    mockOAuthClient.getAccessToken = jest.fn().mockResolvedValue({
      accessToken: 'mock-token',
      expiresIn: 3600,
    });
    tokenManager = new TokenManager(mockOAuthClient);
  });

  it('should fetch a token on the first call', async () => {
    const token = await tokenManager.getToken();
    expect(token).toBe('mock-token');
    expect(mockOAuthClient.getAccessToken).toHaveBeenCalledTimes(1);
  });

  it('should return cached token on subsequent calls', async () => {
    await tokenManager.getToken();
    await tokenManager.getToken();
    expect(mockOAuthClient.getAccessToken).toHaveBeenCalledTimes(1);
  });

  it('should refresh after clearToken', async () => {
    await tokenManager.getToken();
    tokenManager.clearToken();
    await tokenManager.getToken();
    expect(mockOAuthClient.getAccessToken).toHaveBeenCalledTimes(2);
  });
});
