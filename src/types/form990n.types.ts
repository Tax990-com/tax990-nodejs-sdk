export interface USAddress {
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  State: string | null;
  ZipCd: string | null;
}

export interface ForeignAddress {
  Address1: string | null;
  Address2: string | null;
  City: string | null;
  ProvinceOrStateNm: string | null;
  Country: string | null;
  PostalCd: string | null;
}

export interface Business {
  BusinessId: string | null;
  BusinessNm: string | null;
  EIN: string | null;
  DBANm: string | null;
  InCareOfNm: string | null;
  EmailAddress: string | null;
  Phone: string | null;
  IsForeign: boolean | null;
  USAddress: USAddress | null;
  ForeignAddress: ForeignAddress | null;
}

export interface PrincipalOfficer {
  OfficerNm: string | null;
  IsForeign: boolean | null;
  USAddress: USAddress | null;
  ForeignAddress: ForeignAddress | null;
}

export interface Form990NData {
  SequenceId: string | null;
  RecordId: string | null;
  TaxYr: string | null;
  TaxPeriodBeginDt: string | null;
  TaxPeriodEndDt: string | null;
  IsGrossReceiptsUnder50K: boolean | null;
  IsOrganizationTerminated: boolean | null;
  WebsiteAddress: string | null;
  PrincipalOfficer: PrincipalOfficer | null;
}

export interface Form990NRecord {
  Business: Business;
  Form990N: Form990NData;
}

export interface CreatePayload {
  Form990NRecords: Form990NRecord[];
}

export interface UpdatePayload {
  SubmissionId: string;
  IsAllowPartialUpdates: boolean;
  Form990NRecords: Form990NRecord[];
}

export interface TransmitPayload {
  SubmissionId: string;
  RecordIds?: string[];
}

export interface StructuredError {
  Classification: string;
  Code: string;
  Message: string;
  Field: string | null;
}

export type RecordStatus =
  | 'Created'
  | 'Updated'
  | 'Deleted'
  | 'Transmitted'
  | 'Accepted'
  | 'Rejected'
  | 'In-Progress'
  | 'Failed';

export interface RejectionError {
  ErrorCode: string | null;
  ErrorMessage: string | null;
}

export interface SuccessRecord {
  SequenceId: string;
  RecordId: string;
  BusinessId: string;
  RecordStatus: RecordStatus;
  ReturnNumber?: string;
  RejectionErrors?: RejectionError[];
  CreatedTs: string;
  UpdatedTs: string;
  Message?: string;
}

export interface ErrorRecord {
  SequenceId: string | null;
  RecordId: string | null;
  BusinessId: string | null;
  RecordStatus: string;
  Errors: StructuredError[];
}

export interface ApiResponse<S = SuccessRecord, E = ErrorRecord> {
  StatusCode: number;
  StatusNm: string;
  StatusMessage: string;
  CorrelationId: string;
  SubmissionId: string | null;
  Form990NRecords: {
    SuccessRecords: S[] | null;
    ErrorRecords: E[] | null;
  } | null;
  Errors: StructuredError[] | null;
}

export interface GetSuccessRecord extends SuccessRecord {
  Business: Business;
  Form990N: {
    TaxYear: string | null;
    TaxPeriodBeginDate: string | null;
    TaxPeriodEndDate: string | null;
    IsGrossReceiptsUnder50K: boolean | null;
    IsOrganizationTerminated: boolean | null;
    WebsiteAddress: string | null;
    PrincipalOfficer: PrincipalOfficer | null;
  };
}

export interface ValidationWarning {
  ErrorCode: string;
  Name: string;
  Message: string;
}

export interface ValidateSuccessRecord {
  SequenceId: string;
  RecordId: string;
  Warnings: ValidationWarning[] | null;
}

export interface ValidateErrorRecord {
  SequenceId: string;
  RecordId: string;
  Errors: ValidationWarning[];
}

export interface TransmitSuccessRecord {
  SequenceId: string;
  RecordId: string;
  Status: 'Transmitted';
  StatusTs: string | null;
}

export interface TransmitErrorRecord {
  SequenceId: string;
  RecordId: string;
  Status: 'Failed';
  ErrorMessage: string;
}

export interface PDFRecord {
  RecordId: string;
  PDFUrl: string;
}

export interface PDFResponse {
  StatusCode: number;
  StatusName: string;
  StatusMessage: string;
  CorrelationId: string;
  SubmissionId: string;
  Form990NRecords: PDFRecord[] | null;
  Errors: Array<{ RecordId: string; Message: string }> | null;
}

export enum FilingStatusId {
  INPROGRESS = 1,
  TRANSMITTED = 2,
  ACCEPTED = 3,
  REJECTED = 4,
}

export enum FormType {
  Form990 = 1,
  Form990EZ = 2,
  Form990N = 3,
  Form990PF = 4,
}
