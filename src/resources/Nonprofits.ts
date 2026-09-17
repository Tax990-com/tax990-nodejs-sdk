import { HttpClient } from '../http/HttpClient';
import type { NonprofitsResponse } from '../types/nonprofits.types';

export class Nonprofits {
  constructor(private readonly http: HttpClient) {}

  async getOrganizationDetailsByEIN(params: {
    ein: string;
  }): Promise<NonprofitsResponse> {
    return this.http.get('/v1/nonprofits/getOrganizationDetailsByEIN', {
      ein: params.ein,
    });
  }
}
