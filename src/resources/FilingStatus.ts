import { HttpClient } from '../http/HttpClient';
import type { ApiResponse, SuccessRecord, ErrorRecord } from '../types/form990n.types';

export class FilingStatus {
  constructor(private readonly http: HttpClient) {}

  async get(params: {
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
