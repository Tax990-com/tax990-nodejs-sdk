import type { Tax990TokenResponse, GenerateJWSResponse } from '../../src/types/auth.types';

export const validConfig = {
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret-32-chars-long!!',
  userToken: 'test-user-token',
  environment: 'sandbox' as const,
  apiUrl: 'http://localhost:9005',
  oauthUrl: 'http://localhost:4000',
};

export const jwsResponse: GenerateJWSResponse = {
  statusCode: 200,
  status: 'Success',
  message: 'JWS Generated Successfully',
  response: { JWSToken: 'eyJhbGciOiJIUzI1NiJ9.test.signature' },
};

export const tokenResponse: Tax990TokenResponse = {
  statusCode: 200,
  status: 'OK',
  message: 'Successful API call.',
  response: {
    AccessToken: 'eyJhbGciOiJSUzI1NiJ9.access.signature',
    TokenType: 'Bearer',
    ExpiresIn: 3600,
    Errors: null,
  },
};

export const unauthorizedTokenResponse: Tax990TokenResponse = {
  statusCode: 401,
  status: 'Unauthorized',
  message: 'Unauthorized',
  response: {
    AccessToken: '',
    Errors: {
      ErrorCode: '401-ERR-03',
      ErrorName: 'Authentication',
      ErrorMessage: 'Invalid credentials',
    },
  },
};
