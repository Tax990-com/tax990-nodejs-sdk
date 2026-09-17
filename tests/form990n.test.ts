import { Form990N } from '../src/resources/Form990N';
import { HttpClient } from '../src/http/HttpClient';
import {
  SAMPLE_CREATE_PAYLOAD,
  SAMPLE_UPDATE_PAYLOAD,
  SAMPLE_TRANSMIT_PAYLOAD,
  MOCK_CREATE_RESPONSE,
  MOCK_GET_RESPONSE,
} from './fixtures/form990n.fixtures';

jest.mock('../src/http/HttpClient');

describe('Form990N', () => {
  let mockHttp: jest.Mocked<HttpClient>;
  let form990n: Form990N;

  beforeEach(() => {
    mockHttp = new HttpClient({ baseUrl: 'http://localhost:9005' }) as jest.Mocked<HttpClient>;
    form990n = new Form990N(mockHttp);
  });

  describe('create', () => {
    it('should POST to /v1/form990n/create with idempotency key', async () => {
      mockHttp.post = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      const result = await form990n.create(SAMPLE_CREATE_PAYLOAD, 'idem-key-001');
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/v1/form990n/create',
        SAMPLE_CREATE_PAYLOAD,
        { 'idempotency-key': 'idem-key-001' },
      );
      expect(result.SubmissionId).toBe('sub-001');
    });

    it('should auto-generate idempotency key when not provided', async () => {
      mockHttp.post = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      await form990n.create(SAMPLE_CREATE_PAYLOAD);
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/v1/form990n/create',
        SAMPLE_CREATE_PAYLOAD,
        expect.objectContaining({ 'idempotency-key': expect.any(String) }),
      );
    });
  });

  describe('submit', () => {
    it('should be an alias for create', async () => {
      mockHttp.post = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      const result = await form990n.submit(SAMPLE_CREATE_PAYLOAD);
      expect(result).toEqual(MOCK_CREATE_RESPONSE);
    });
  });

  describe('update', () => {
    it('should POST to /v1/form990n/update', async () => {
      mockHttp.post = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      await form990n.update(SAMPLE_UPDATE_PAYLOAD);
      expect(mockHttp.post).toHaveBeenCalledWith('/v1/form990n/update', SAMPLE_UPDATE_PAYLOAD);
    });
  });

  describe('get', () => {
    it('should GET /v1/form990n/get with SubmissionId', async () => {
      mockHttp.get = jest.fn().mockResolvedValue(MOCK_GET_RESPONSE);
      await form990n.get({ SubmissionId: 'sub-001' });
      expect(mockHttp.get).toHaveBeenCalledWith('/v1/form990n/get', {
        SubmissionId: 'sub-001',
        RecordId: undefined,
      });
    });

    it('should pass RecordId when provided', async () => {
      mockHttp.get = jest.fn().mockResolvedValue(MOCK_GET_RESPONSE);
      await form990n.get({ SubmissionId: 'sub-001', RecordId: 'rec-001' });
      expect(mockHttp.get).toHaveBeenCalledWith('/v1/form990n/get', {
        SubmissionId: 'sub-001',
        RecordId: 'rec-001',
      });
    });
  });

  describe('list', () => {
    it('should GET /v1/form990n/list with SubmissionId', async () => {
      mockHttp.get = jest.fn().mockResolvedValue(MOCK_GET_RESPONSE);
      await form990n.list({ SubmissionId: 'sub-001' });
      expect(mockHttp.get).toHaveBeenCalledWith('/v1/form990n/list', {
        SubmissionId: 'sub-001',
        BusinessId: undefined,
      });
    });
  });

  describe('delete', () => {
    it('should DELETE /v1/form990n/delete', async () => {
      mockHttp.delete = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      await form990n.delete({ SubmissionId: 'sub-001' });
      expect(mockHttp.delete).toHaveBeenCalledWith('/v1/form990n/delete', {
        SubmissionId: 'sub-001',
        RecordId: undefined,
      });
    });
  });

  describe('validate', () => {
    it('should join RecordIds array into comma-separated string', async () => {
      mockHttp.get = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      await form990n.validate({ SubmissionId: 'sub-001', RecordIds: ['rec-001', 'rec-002'] });
      expect(mockHttp.get).toHaveBeenCalledWith('/v1/form990n/validate', {
        SubmissionId: 'sub-001',
        RecordIds: 'rec-001,rec-002',
      });
    });

    it('should pass RecordIds string as-is', async () => {
      mockHttp.get = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      await form990n.validate({ SubmissionId: 'sub-001', RecordIds: 'rec-001' });
      expect(mockHttp.get).toHaveBeenCalledWith('/v1/form990n/validate', {
        SubmissionId: 'sub-001',
        RecordIds: 'rec-001',
      });
    });
  });

  describe('transmit', () => {
    it('should POST to /v1/form990n/transmit', async () => {
      mockHttp.post = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      await form990n.transmit(SAMPLE_TRANSMIT_PAYLOAD);
      expect(mockHttp.post).toHaveBeenCalledWith('/v1/form990n/transmit', SAMPLE_TRANSMIT_PAYLOAD);
    });
  });

  describe('getPDF', () => {
    it('should GET /v1/form990n/getPDF', async () => {
      mockHttp.get = jest.fn().mockResolvedValue({ StatusCode: 200 });
      await form990n.getPDF({ SubmissionId: 'sub-001', RecordIds: ['rec-001'] });
      expect(mockHttp.get).toHaveBeenCalledWith('/v1/form990n/getPDF', {
        SubmissionId: 'sub-001',
        RecordIds: 'rec-001',
      });
    });
  });

  describe('status', () => {
    it('should GET /v1/form990n/status', async () => {
      mockHttp.get = jest.fn().mockResolvedValue(MOCK_CREATE_RESPONSE);
      await form990n.status({ SubmissionId: 'sub-001' });
      expect(mockHttp.get).toHaveBeenCalledWith('/v1/form990n/status', {
        SubmissionId: 'sub-001',
        RecordIds: undefined,
      });
    });
  });
});
