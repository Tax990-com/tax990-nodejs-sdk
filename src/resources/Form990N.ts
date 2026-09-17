import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '../http/HttpClient';
import type {
  ApiResponse,
  CreatePayload,
  UpdatePayload,
  ErrorRecord,
  GetSuccessRecord,
  PDFResponse,
  SuccessRecord,
  TransmitErrorRecord,
  TransmitPayload,
  TransmitSuccessRecord,
  ValidateErrorRecord,
  ValidateSuccessRecord,
} from '../types/form990n.types';

export class Form990N {
  constructor(private readonly http: HttpClient) {}

  async create(
    payload: CreatePayload,
    idempotencyKey?: string,
  ): Promise<ApiResponse<SuccessRecord, ErrorRecord>> {
    const key = idempotencyKey ?? uuidv4();
    return this.http.post('/v1/form990n/create', payload, {
      'idempotency-key': key,
    });
  }

  async submit(
    payload: CreatePayload,
    idempotencyKey?: string,
  ): Promise<ApiResponse<SuccessRecord, ErrorRecord>> {
    return this.create(payload, idempotencyKey);
  }

  async update(
    payload: UpdatePayload,
  ): Promise<ApiResponse<SuccessRecord, ErrorRecord>> {
    return this.http.post('/v1/form990n/update', payload);
  }

  async get(params: {
    SubmissionId: string;
    RecordId?: string;
  }): Promise<ApiResponse<GetSuccessRecord, ErrorRecord>> {
    return this.http.get('/v1/form990n/get', {
      SubmissionId: params.SubmissionId,
      RecordId: params.RecordId,
    });
  }

  async list(params: {
    SubmissionId?: string;
    BusinessId?: string;
  }): Promise<ApiResponse<GetSuccessRecord, ErrorRecord>> {
    return this.http.get('/v1/form990n/list', {
      SubmissionId: params.SubmissionId,
      BusinessId: params.BusinessId,
    });
  }

  async delete(params: {
    SubmissionId: string;
    RecordId?: string;
  }): Promise<ApiResponse<SuccessRecord, ErrorRecord>> {
    return this.http.delete('/v1/form990n/delete', {
      SubmissionId: params.SubmissionId,
      RecordId: params.RecordId,
    });
  }

  async validate(params: {
    SubmissionId: string;
    RecordIds: string | string[];
  }): Promise<ApiResponse<ValidateSuccessRecord, ValidateErrorRecord>> {
    const RecordIds = Array.isArray(params.RecordIds)
      ? params.RecordIds.join(',')
      : params.RecordIds;
    return this.http.get('/v1/form990n/validate', {
      SubmissionId: params.SubmissionId,
      RecordIds,
    });
  }

  async transmit(
    payload: TransmitPayload,
  ): Promise<ApiResponse<TransmitSuccessRecord, TransmitErrorRecord>> {
    return this.http.post('/v1/form990n/transmit', payload);
  }

  async getPDF(params: {
    SubmissionId: string;
    RecordIds?: string | string[];
  }): Promise<PDFResponse> {
    const RecordIds = Array.isArray(params.RecordIds)
      ? params.RecordIds.join(',')
      : params.RecordIds;
    return this.http.get('/v1/form990n/getPDF', {
      SubmissionId: params.SubmissionId,
      RecordIds,
    });
  }

  async status(params: {
    SubmissionId: string;
    RecordIds?: string | string[];
  }): Promise<ApiResponse<SuccessRecord, ErrorRecord>> {
    const RecordIds = Array.isArray(params.RecordIds)
      ? params.RecordIds.join(',')
      : params.RecordIds;
    return this.http.get('/v1/form990n/status', {
      SubmissionId: params.SubmissionId,
      RecordIds,
    });
  }
}
