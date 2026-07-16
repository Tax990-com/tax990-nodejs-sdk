import type {
  CreatePayload,
  ApiResponse,
  SuccessRecord,
  ErrorRecord,
  Form990NRecord,
} from '../../src/types/form990n.types';

export const usRecord: Form990NRecord = {
  Business: {
    BusinessId: null,
    BusinessNm: 'Test Nonprofit Org',
    EIN: '12-3456789',
    DBANm: null,
    InCareOfNm: null,
    EmailAddress: 'test@example.org',
    Phone: '5551234567',
    IsForeign: false,
    USAddress: {
      Address1: '123 Main St',
      Address2: null,
      City: 'Austin',
      State: 'TX',
      ZipCd: '78701',
    },
    ForeignAddress: null,
  },
  Form990N: {
    SequenceId: '1',
    RecordId: null,
    TaxYr: '2024',
    TaxPeriodBeginDt: '2024-01-01',
    TaxPeriodEndDt: '2024-12-31',
    IsGrossReceiptsUnder50K: true,
    IsOrganizationTerminated: false,
    WebsiteAddress: 'https://example.org',
    PrincipalOfficer: {
      OfficerNm: 'Jane Smith',
      IsForeign: false,
      USAddress: {
        Address1: '123 Main St',
        Address2: null,
        City: 'Austin',
        State: 'TX',
        ZipCd: '78701',
      },
      ForeignAddress: null,
    },
  },
};

export const createPayload: CreatePayload = {
  Form990NRecords: [usRecord],
};

export const createResponse: ApiResponse<SuccessRecord, ErrorRecord> = {
  StatusCode: 200,
  StatusNm: 'Ok',
  StatusMessage: 'Successful API call',
  CorrelationId: 'correlation-id-123',
  SubmissionId: 'submission-uuid-456',
  Form990NRecords: {
    SuccessRecords: [
      {
        SequenceId: '1',
        RecordId: 'record-uuid-789',
        BusinessId: 'business-uuid-101',
        RecordStatus: 'Created',
        CreatedTs: '2024-01-15T10:00:00.000Z',
        UpdatedTs: '2024-01-15T10:00:00.000Z',
      },
    ],
    ErrorRecords: null,
  },
  Errors: null,
};

export const validationErrorResponse: ApiResponse<SuccessRecord, ErrorRecord> = {
  StatusCode: 400,
  StatusNm: 'BadRequest',
  StatusMessage: 'A validation error has occurred.',
  CorrelationId: 'correlation-id-456',
  SubmissionId: null,
  Form990NRecords: null,
  Errors: [
    {
      Classification: 'validation',
      Code: 'F990N001',
      Message: 'EIN is invalid',
      Field: 'EIN',
    },
  ],
};
