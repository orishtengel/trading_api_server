import { GetKlinesRequest, GetKlinesResponse } from './data.contracts';
import { ApiResponse } from '@shared/http/api';

export interface IDataManager {
  getKlines(request: GetKlinesRequest): Promise<ApiResponse<GetKlinesResponse>>;
}
