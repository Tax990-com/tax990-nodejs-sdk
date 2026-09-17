export class Webhook {
  register(_config: unknown): never {
    throw new Error(
      'Webhook management endpoints are not available in the Tax990 Public API.',
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
