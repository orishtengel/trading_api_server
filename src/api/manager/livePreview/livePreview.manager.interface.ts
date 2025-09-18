import { ApiResponse } from '@shared/http/api';
import {
  StartLivePreviewRequest,
  StartLivePreviewResponse,
} from '@manager/livePreview/contracts/requestResponse/startLivePreview';
import {
  StopLivePreviewRequest,
  StopLivePreviewResponse,
} from '@manager/livePreview/contracts/requestResponse/stopLivePreview';
import {
  GetPnlRequest,
  GetPnlResponse,
} from '@manager/livePreview/contracts/requestResponse/getPnl';

export interface ILivePreviewManager {
  startLivePreview(
    request: StartLivePreviewRequest,
  ): Promise<ApiResponse<StartLivePreviewResponse>>;
  stopLivePreview(request: StopLivePreviewRequest): Promise<ApiResponse<StopLivePreviewResponse>>;
  getPnl(request: GetPnlRequest): Promise<ApiResponse<GetPnlResponse>>;
}
