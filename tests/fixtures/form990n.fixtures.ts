import type {
  CreatePayload,
  UpdatePayload,
  TransmitPayload,
  ApiResponse,
  SuccessRecord,
  ErrorRecord,
  GetSuccessRecord,
} from '../../src/types/form990n.types';

export const SAMPLE_CREATE_PAYLOAD: CreatePayload = {
  Form990NRecords: [
    {
      Business: {
        BusinessId: null,
        BusinessNm: 'Test Nonprofit Organization',
        EIN: '123456789',
        DBANm: null,
        InCareOfNm: null,
        EmailAddress: 'test@nonprofit.org',
        Phone: '5551234567',
        IsForeign: false,
        USAddress: {
          Address1: '123 Main Street',
          Address2: null,
          City: 'Springfield',
          State: 'IL',
          ZipCd: '62701',
        },
        ForeignAddress: null,
      },
      Form990N: {
        SequenceId: 'seq-001',
        RecordId: null,
        TaxYr: '2024',
        TaxPeriodBeginDt: '2024-01-01',
        TaxPeriodEndDt: '2024-12-31',
        IsGrossReceiptsUnder50K: true,
        IsOrganizationTerminated: false,
        WebsiteAddress: 'https://testnonprofit.org',
        PrincipalOfficer: {
          OfficerNm: 'Jane Smith',
          IsForeign: false,
          USAddress: {
            Address1: '456 Oak Avenue',
            Address2: null,
            City: 'Springfield',
            State: 'IL',
            ZipCd: '62701',
          },
          ForeignAddress: null,
        },
      },
    },
  ],
};

export const SAMPLE_UPDATE_PAYLOAD: UpdatePayload = {
  SubmissionId: 'sub-001',
  IsAllowPartialUpdates: false,
  Form990NRecords: SAMPLE_CREATE_PAYLOAD.Form990NRecords,
};

export const SAMPLE_TRANSMIT_PAYLOAD: TransmitPayload = {
  SubmissionId: 'sub-001',
  RecordIds: ['rec-001'],
};

export const MOCK_CREATE_RESPONSE: ApiResponse<SuccessRecord, ErrorRecord> = {
  StatusCode: 200,
  StatusNm: 'Success',
  StatusMessage: 'Form 990-N records created successfully',
  CorrelationId: 'corr-001',
  SubmissionId: 'sub-001',
  Form990NRecords: {
    SuccessRecords: [
      {
        SequenceId: 'seq-001',
        RecordId: 'rec-001',
        BusinessId: 'biz-001',
        RecordStatus: 'Created',
        CreatedTs: '2024-01-15T10:00:00Z',
        UpdatedTs: '2024-01-15T10:00:00Z',
      },
    ],
    ErrorRecords: null,
  },
  Errors: null,
};

export const MOCK_GET_RESPONSE: ApiResponse<GetSuccessRecord, ErrorRecord> = {
  StatusCode: 200,
  StatusNm: 'Success',
  StatusMessage: 'Records retrieved successfully',
  CorrelationId: 'corr-002',
  SubmissionId: 'sub-001',
  Form990NRecords: {
    SuccessRecords: [
      {
        SequenceId: 'seq-001',
        RecordId: 'rec-001',
        BusinessId: 'biz-001',
        RecordStatus: 'Created',
        CreatedTs: '2024-01-15T10:00:00Z',
        UpdatedTs: '2024-01-15T10:00:00Z',
        Business: {
          BusinessId: 'biz-001',
          BusinessNm: 'Test Nonprofit Organization',
          EIN: '123456789',
          DBANm: null,
          InCareOfNm: null,
          EmailAddress: 'test@nonprofit.org',
          Phone: '5551234567',
          IsForeign: false,
          USAddress: {
            Address1: '123 Main Street',
            Address2: null,
            City: 'Springfield',
            State: 'IL',
            ZipCd: '62701',
          },
          ForeignAddress: null,
        },
        Form990N: {
          TaxYear: '2024',
          TaxPeriodBeginDate: '2024-01-01',
          TaxPeriodEndDate: '2024-12-31',
          IsGrossReceiptsUnder50K: true,
          IsOrganizationTerminated: false,
          WebsiteAddress: 'https://testnonprofit.org',
          PrincipalOfficer: {
            OfficerNm: 'Jane Smith',
            IsForeign: false,
            USAddress: {
              Address1: '456 Oak Avenue',
              Address2: null,
              City: 'Springfield',
              State: 'IL',
              ZipCd: '62701',
            },
            ForeignAddress: null,
          },
        },
      },
    ],
    ErrorRecords: null,
  },
  Errors: null,
};
