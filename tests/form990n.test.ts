import { AxiosError } from 'axios';
import { Form990N } from '../src/resources/Form990N';
import { HttpClient } from '../src/http/HttpClient';
import { ValidationError } from '../src/errors';
import {
  createPayload,
  createResponse,
  validationErrorResponse,
} from './fixtures/form990n.fixtures';
import { validateEin, formatEin } from '../src/utils/EinValidator';

// Mock axios and axios-retry
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
  const actual = jest.requireActual('axios');
  return {
    ...actual,
    create: jest.fn(() => mockInstance),
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

function makeResource(): Form990N {
  const http = new HttpClient({ baseUrl: 'http://localhost:9005' });
  return new Form990N(http);
}

describe('Form990N resource', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('create / submit', () => {
    it('POSTs to /v1/form990n/create and returns the response', async () => {
      getMockInstance().post.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      const result = await resource.create(createPayload);

      expect(getMockInstance().post).toHaveBeenCalledWith(
        '/v1/form990n/create',
        createPayload,
        expect.anything(),
      );
      expect(result.StatusCode).toBe(200);
      expect(result.Form990NRecords?.SuccessRecords?.[0].RecordStatus).toBe('Created');
    });

    it('submit() is an alias for create()', async () => {
      getMockInstance().post.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      await resource.submit(createPayload);
      expect(getMockInstance().post).toHaveBeenCalledWith(
        '/v1/form990n/create',
        expect.anything(),
        expect.anything(),
      );
    });

    it('uses the provided idempotencyKey', async () => {
      getMockInstance().post.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      await resource.create(createPayload, 'my-key-123');
      expect(getMockInstance().post).toHaveBeenCalledWith(
        '/v1/form990n/create',
        createPayload,
        expect.objectContaining({ headers: expect.objectContaining({ 'idempotency-key': 'my-key-123' }) }),
      );
    });
  });

  describe('get', () => {
    it('GETs /v1/form990n/get with SubmissionId', async () => {
      getMockInstance().get.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      await resource.get({ SubmissionId: 'sub-123' });

      expect(getMockInstance().get).toHaveBeenCalledWith(
        '/v1/form990n/get',
        expect.objectContaining({ params: expect.objectContaining({ SubmissionId: 'sub-123' }) }),
      );
    });
  });

  describe('list', () => {
    it('GETs /v1/form990n/list with SubmissionId', async () => {
      getMockInstance().get.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      await resource.list({ SubmissionId: 'sub-123' });

      expect(getMockInstance().get).toHaveBeenCalledWith(
        '/v1/form990n/list',
        expect.objectContaining({ params: { SubmissionId: 'sub-123' } }),
      );
    });
  });

  describe('delete', () => {
    it('DELETEs /v1/form990n/delete', async () => {
      getMockInstance().delete.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      await resource.delete({ SubmissionId: 'sub-123' });

      expect(getMockInstance().delete).toHaveBeenCalledWith(
        '/v1/form990n/delete',
        expect.objectContaining({ params: expect.objectContaining({ SubmissionId: 'sub-123' }) }),
      );
    });
  });

  describe('validate', () => {
    it('joins array RecordIds with commas', async () => {
      getMockInstance().get.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      await resource.validate({ SubmissionId: 'sub-123', RecordIds: ['r1', 'r2', 'r3'] });

      expect(getMockInstance().get).toHaveBeenCalledWith(
        '/v1/form990n/validate',
        expect.objectContaining({
          params: expect.objectContaining({ RecordIds: 'r1,r2,r3' }),
        }),
      );
    });
  });

  describe('transmit', () => {
    it('POSTs to /v1/form990n/transmit', async () => {
      getMockInstance().post.mockResolvedValueOnce({ data: createResponse });
      const resource = makeResource();

      await resource.transmit({ SubmissionId: 'sub-123' });

      expect(getMockInstance().post).toHaveBeenCalledWith(
        '/v1/form990n/transmit',
        { SubmissionId: 'sub-123' },
        expect.anything(),
      );
    });
  });

  describe('error mapping', () => {
    it('throws ValidationError for 400 with Errors array', async () => {
      const axiosError = new AxiosError(
        'Bad Request',
        'ERR_BAD_REQUEST',
        undefined,
        undefined,
        {
          status: 400,
          data: validationErrorResponse,
          headers: {},
          config: {} as never,
          statusText: 'Bad Request',
        },
      );
      getMockInstance().post.mockRejectedValueOnce(axiosError);
      const resource = makeResource();

      await expect(resource.create(createPayload)).rejects.toThrow(ValidationError);
    });
  });
});

describe('EinValidator', () => {
  it('accepts 9-digit EIN', () => {
    expect(validateEin('123456789')).toBe(true);
  });

  it('accepts formatted XX-XXXXXXX EIN', () => {
    expect(validateEin('12-3456789')).toBe(true);
  });

  it('rejects invalid EIN', () => {
    expect(validateEin('1234')).toBe(false);
    expect(validateEin('12-345678')).toBe(false);
    expect(validateEin('abc123456')).toBe(false);
  });

  it('formatEin adds hyphen', () => {
    expect(formatEin('123456789')).toBe('12-3456789');
  });

  it('formatEin is idempotent on already-formatted EIN', () => {
    expect(formatEin('12-3456789')).toBe('12-3456789');
  });

  it('formatEin throws on invalid input', () => {
    expect(() => formatEin('123')).toThrow('Invalid EIN');
  });
});
