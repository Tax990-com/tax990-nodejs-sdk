import type { Tax990ClientConfig } from '../../src/types/auth.types';

export const TEST_CONFIG: Tax990ClientConfig = {
  clientId: 'test-client-id',
  clientSecret: 'test-client-secret',
  userToken: 'test-user-token',
  environment: 'sandbox',
};

export const MOCK_ACCESS_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock-payload.mock-signature';

export const MOCK_TOKEN_RESPONSE = {
  statusCode: 200,
  status: 'Success',
  message: 'Token generated successfully',
  response: {
    AccessToken: MOCK_ACCESS_TOKEN,
    TokenType: 'Bearer' as const,
    ExpiresIn: 3600,
    Errors: null,
  },
};

export const MOCK_JWS_RESPONSE = {
  statusCode: 200,
  status: 'Success',
  message: 'JWS generated successfully',
  response: {
    JWSToken: 'eyJhbGciOiJIUzI1NiJ9.mock-jws-payload.mock-jws-signature',
  },
};
