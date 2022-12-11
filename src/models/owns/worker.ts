import { OwnUser } from '../user';
import { Customer } from './customer';

export type Worker = OwnUser | Customer;
export const isUser = (worker: Worker): worker is OwnUser => {
  return !('billingName' in worker);
};

export const isCustomer = (worker: Worker): worker is Customer => {
  return 'billingName' in worker;
};
