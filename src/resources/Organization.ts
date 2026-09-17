import { HttpClient } from '../http/HttpClient';
import type { ApiResponse, GetSuccessRecord, ErrorRecord } from '../types/form990n.types';

export class Organization {
  constructor(private readonly http: HttpClient) {}

  async list(params: {
    SubmissionId?: string;
    BusinessId?: string;
  }): Promise<ApiResponse<GetSuccessRecord, ErrorRecord>> {
    return this.http.get('/v1/form990n/list', {
      SubmissionId: params.SubmissionId,
      BusinessId: params.BusinessId,
    });
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
}
