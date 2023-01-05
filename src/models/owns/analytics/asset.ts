import { AssetMiniDTO } from '../asset';

export interface TimeCostByAsset extends AssetMiniDTO {
  time: number;
  cost: number;
}
