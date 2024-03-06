import { UserMiniDTO } from '../user';
import { Audit } from './audit';
import { PartMiniDTO } from './part';
import { TeamMiniDTO } from './team';
import { VendorMiniDTO } from './vendor';
import Location from './location';
import { CustomerMiniDTO } from './customer';
import File, { FileMiniDTO } from './file';
import Category from './category';

export default interface Asset extends Audit {
  id: number;
  name: string;
  description: string;
}

export type AssetStatus = 'OPERATIONAL' | 'DOWN';
export interface AssetDTO extends Audit {
  id: number;
  name: string;
  image: File;
  location: Location;
  area: string;
  model: string;
  serialNumber: string;
  status: AssetStatus;
  barCode: string;
  category: Category;
  description: string;
  primaryUser: UserMiniDTO;
  assignedTo: UserMiniDTO[];
  teams: TeamMiniDTO[];
  vendors: VendorMiniDTO[];
  customers: CustomerMiniDTO[];
  parentAsset: AssetMiniDTO;
  openWorkOrders: number;
  additionalInfos: string;
  hasChildren?: boolean;
  warrantyExpirationDate?: string;
  acquisitionCost: number;
  inServiceDate?: string;
  parts: PartMiniDTO[];
  files: FileMiniDTO[];
  power: string;
  manufacturer: string;
}
export interface AssetRow extends AssetDTO {
  hierarchy: number[];
  childrenFetched?: boolean;
}
export interface AssetMiniDTO {
  id: number;
  name: string;
}
export const assets: Asset[] = [
  {
    id: 212,
    name: 'cgvg',
    createdAt: 'dfggj',
    description: 'bjhb',
    createdBy: 1,
    updatedAt: 'ghfgj',
    updatedBy: 1
  },
  {
    id: 44,
    name: 'fcgvc',
    createdAt: 'dfggj',
    createdBy: 1,
    description: 'fchg',
    updatedAt: 'ghfgj',
    updatedBy: 1
  }
];
