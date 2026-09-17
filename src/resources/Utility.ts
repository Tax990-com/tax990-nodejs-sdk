import { HttpClient } from '../http/HttpClient';
import type {
  PingResponse,
  SubmissionIdsResponse,
  RecordIdsResponse,
  BusinessIdsResponse,
  SubmissionIdByBusinessIdResponse,
  SubmissionIdByRecordIdResponse,
  RecordIdBySubmissionIdResponse,
  BusinessIdBySubmissionIdResponse,
  RecordDetailBySubmissionIdResponse,
} from '../types/utility.types';

export class Utility {
  constructor(private readonly http: HttpClient) {}

  async ping(): Promise<PingResponse> {
    return this.http.get('/v1/utility/ping');
  }

  async getAllSubmissionIds(): Promise<SubmissionIdsResponse> {
    return this.http.get('/v1/utility/getAllSubmissionId');
  }

  async getSubmissionIdByBusinessId(params: {
    businessId: string;
  }): Promise<SubmissionIdByBusinessIdResponse> {
    return this.http.get('/v1/utility/getSubmissionIdByBusinessId', {
      businessId: params.businessId,
    });
  }

  async getSubmissionIdByRecordId(params: {
    recordId: string;
  }): Promise<SubmissionIdByRecordIdResponse> {
    return this.http.get('/v1/utility/getSubmissionIdByRecordId', {
      recordId: params.recordId,
    });
  }

  async getRecordIds(): Promise<RecordIdsResponse> {
    return this.http.get('/v1/utility/getRecordIds');
  }

  async getRecordIdBySubmissionId(params: {
    submissionId: string;
  }): Promise<RecordIdBySubmissionIdResponse> {
    return this.http.get('/v1/utility/getRecordIdBySubmissionId', {
      submissionId: params.submissionId,
    });
  }

  async getRecordDetailBySubmissionId(params: {
    submissionId: string;
  }): Promise<RecordDetailBySubmissionIdResponse> {
    return this.http.get('/v1/utility/getRecordDetailBySubmissionId', {
      submissionId: params.submissionId,
    });
  }

  async getAllBusinessIds(): Promise<BusinessIdsResponse> {
    return this.http.get('/v1/utility/getAllBusinessId');
  }

  async getBusinessIdBySubmissionId(params: {
    submissionId: string;
  }): Promise<BusinessIdBySubmissionIdResponse> {
    return this.http.get('/v1/utility/getBusinessIdBySubmissionId', {
      submissionId: params.submissionId,
    });
  }
}
