import { assets } from './asset';
import { files } from './file';
import WorkOrder, { workOrders } from './workOrder';
import { locations } from './location';
import { teams } from './team';
import { WorkOrderBase } from './workOrderBase';
import { categories } from './category';

export default interface Request extends WorkOrderBase {
  cancelled: boolean;
  workOrder: WorkOrder;
}

export const requests: Request[] = [
  {
    title: 'Request 1',
    id: 54,
    image: files[0],
    cancelled: true,
    workOrder: workOrders[0],
    files: [],
    asset: assets[0],
    location: locations[0],
    primaryUser: null,
    dueDate: 'dsds',
    category: categories[0],
    team: teams[0],
    assignedTo: [],
    description: 'jvjhbh',
    priority: 'HIGH',
    createdAt: 'fghb',
    createdBy: 1,
    updatedAt: 'string',
    updatedBy: 1,
    estimatedDuration: 4,
    requiredSignature: false
  }
];
