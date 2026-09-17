import { StructuredError } from './form990n.types';

export interface OrganizationDetails {
  OrganizationName: string;
  EIN: string;
  OrganizationAddress1: string;
  OrganizationCity: string;
  OrganizationState: string;
  OrganizationCountry: string;
  PrincipalOfficerName: string;
  PrincipalOfficerAddress1: string;
  PrincipalOfficerCity: string;
  PrincipalOfficerState: string;
  PrincipalOfficerCountry: string;
}

export interface NonprofitsResponse {
  StatusCode: number;
  StatusName: string;
  StatusMessage: string;
  CorrelationId: string;
  Organization: OrganizationDetails | null;
  Errors: StructuredError[] | null;
}
