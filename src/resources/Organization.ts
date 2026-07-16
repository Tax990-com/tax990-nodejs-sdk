import { HttpClient } from '../http/HttpClient';
import type { ApiResponse, GetSuccessRecord, ErrorRecord } from '../types/form990n.types';

/**
 * Organization data is embedded in Form990N records per ANALYSIS.md.
 * This resource queries form990n endpoints and surfaces the Business fields.
 */
export class Organization {
  constructor(private readonly http: HttpClient) {}

  /**
   * List organizations by SubmissionId or BusinessId.
   * Wraps GET /v1/form990n/list
   */
  async list(params: {
    SubmissionId?: string;
    BusinessId?: string;
  }): Promise<ApiResponse<GetSuccessRecord, ErrorRecord>> {
    return this.http.get('/v1/form990n/list', {
      SubmissionId: params.SubmissionId,
      BusinessId: params.BusinessId,
    });
  }

  /**
   * Get a single organization's filing record.
   * Wraps GET /v1/form990n/get
   */
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
