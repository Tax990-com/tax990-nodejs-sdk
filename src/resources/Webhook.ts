// Webhook management endpoints are not documented in the Tax990 Public API (ANALYSIS.md).
// This resource is a stub reserved for future use.
// Use verifyWebhookSignature from utils/ to verify incoming webhook payloads.

export class Webhook {
  register(_config: unknown): never {
    throw new Error(
      'Webhook management endpoints are not available in the Tax990 Public API. ' +
        'See ANALYSIS.md for the documented endpoint list.',
    );
  }

  list(): never {
    throw new Error(
      'Webhook management endpoints are not available in the Tax990 Public API.',
    );
  }

  delete(_id: string): never {
    throw new Error(
      'Webhook management endpoints are not available in the Tax990 Public API.',
    );
  }
}
