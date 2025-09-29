import { GetKlinesRequest, GetKlinesResponse } from './data.contracts';
import { GetSymbolsDataRequest, GetSymbolsDataResponse } from './contracts/requestResponse/getSymbolData';
import { ApiResponse } from '@shared/http/api';

export interface IDataManager {
  getKlines(request: GetKlinesRequest): Promise<ApiResponse<GetKlinesResponse>>;
  getSymbolsData(request: GetSymbolsDataRequest): Promise<ApiResponse<GetSymbolsDataResponse>>;
}
