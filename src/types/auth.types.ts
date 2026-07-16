export interface Tax990ClientConfig {
  clientId: string;
  clientSecret: string;
  userToken: string;
  environment?: 'production' | 'sandbox';
  /** Override the Form990N API base URL */
  apiUrl?: string;
  /** Override the OAuth API base URL */
  oauthUrl?: string;
  /** Request timeout in ms. Default: 30000 */
  timeout?: number;
}

/** POST /Auth/GenerateJWS — request body */
export interface GenerateJWSRequest {
  ClientId: string;
  ClientSecretId: string;
  UserToken: string;
}

/** POST /Auth/GenerateJWS — response */
export interface GenerateJWSResponse {
  statusCode: number;
  status: string;
  message: string;
  response: {
    JWSToken: string;
  };
}

/** GET /Auth/GetTax990Token — response */
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

/** GET /Auth/AuthorizeTax990Token — response */
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
  /** Unix timestamp (ms) when the token expires */
  expiresAt: number;
}
