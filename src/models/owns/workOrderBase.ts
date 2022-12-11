import File from './file';
import { AssetMiniDTO } from './asset';
import { LocationMiniDTO } from './location';
import Team from './team';
import { Audit } from './audit';
import { Worker } from './worker';
import Category from './category';

export interface WorkOrderBase extends Audit {
  title: string;
  id: number;
  description: string;
  priority: string;
  image: File;
  asset: AssetMiniDTO;
  location: LocationMiniDTO;
  estimatedDuration: number;
  primaryUser: Worker;
  assignedTo: Worker[];
  dueDate: string;
  category: Category | null;
  team: Team;
  files: File[];
  requiredSignature: boolean;
}
