import User, { users } from './user';
import Request, { requests } from './request';
import { teams } from './team';
import { assets } from './asset';
import { files } from './file';
import { locations } from './location';
import Category, { categories } from './category';
import { WorkOrderBase } from './workOrderBase';

export default interface WorkOrder extends WorkOrderBase {
  category: Category | null;
  id: number;
  completedBy: User;
  completedOn: string;
  archived: boolean;
  parentRequest: Request;
  status: string;
  //parentPreventiveMaintenance:
}

export const workOrders: WorkOrder[] = [
  {
    completedBy: users[0],
    completedOn: 'string',
    category: categories[0],
    archived: true,
    parentRequest: requests[0],
    files,
    dueDate: 'string',
    status: 'string',
    priority: 'HIGH',
    estimatedDuration: 7,
    image: null,
    description: 'description',
    requiredSignature: true,
    location: locations[0],
    team: teams[0],
    primaryUser: null,
    assignedTo: [],
    asset: assets[0],
    //parentPreventiveMaintenance:
    title: 'Work Order1',
    id: 54,
    createdAt: 'fghb',
    createdBy: 1,
    updatedAt: 'string',
    updatedBy: 1
  }
];
