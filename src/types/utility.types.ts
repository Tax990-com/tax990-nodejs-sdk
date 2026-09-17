import { StructuredError } from './form990n.types';

export interface UtilityResponse {
  StatusCode: number;
  StatusName: string;
  StatusMessage: string;
  CorrelationId: string;
  Errors: StructuredError[] | null;
  [key: string]: unknown;
}

export interface UtilityRecordDetail {
  RecordId: string;
  BusinessId: string;
  EIN: string;
  OrganizationName: string | null;
  TaxYear: string | null;
  FormType: string;
  ReturnStatus: string;
}

export interface SubmissionIdsResponse extends UtilityResponse {
  SubmissionIds: string[];
}

export interface RecordIdsResponse extends UtilityResponse {
  RecordIds: string[];
}

export interface BusinessIdsResponse extends UtilityResponse {
  BusinessIds: string[];
}

export interface SubmissionIdByBusinessIdResponse extends UtilityResponse {
  BusinessName: string;
  EIN: string;
  SubmissionIds: string[];
}

export interface SubmissionIdByRecordIdResponse extends UtilityResponse {
  SubmissionId: string | null;
}

export interface RecordIdBySubmissionIdResponse extends UtilityResponse {
  RecordIds: string[];
}

export interface BusinessIdBySubmissionIdResponse extends UtilityResponse {
  BusinessIds: string[];
}

export interface RecordDetailBySubmissionIdResponse extends UtilityResponse {
  Records: UtilityRecordDetail[];
}

export interface PingResponse {
  StatusCode: number;
  StatusName: string;
  StatusMessage: string;
}
