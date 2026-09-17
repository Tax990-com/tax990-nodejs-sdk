export interface Tax990ClientConfig {
  clientId: string;
  clientSecret: string;
  userToken: string;
  environment?: 'production' | 'development';
  apiUrl?: string;
  oauthUrl?: string;
  timeout?: number;
}

export interface GenerateJWSRequest {
  ClientId: string;
  ClientSecretId: string;
  UserToken: string;
}

export interface GenerateJWSResponse {
  statusCode: number;
  status: string;
  message: string;
  response: {
    JWSToken: string;
  };
}

export interface Tax990TokenResponse {
  statusCode: number;
  status: string;
  message: string;
  response: {
    AccessToken: string;
    TokenType?: 'Bearer';
    ExpiresIn?: number;
    Errors: null | {
      ErrorCode: string;
      ErrorName: string;
      ErrorMessage: string;
    };
  };
}

export interface AuthorizeTokenResponse {
  statusCode: number;
  status: string;
  message: string;
  response: {
    IsJWTAuthorized: boolean;
    UserToken?: string;
    UserId?: string | number;
    TokenType?: 'access';
    UnAuthorizeReason?: 'JWT_INVALID' | 'EXPIRED';
  };
}

export interface StoredToken {
  accessToken: string;
  expiresAt: number;
}
