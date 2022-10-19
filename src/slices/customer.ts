import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import { Customer } from '../models/owns/customer';
import api from '../utils/api';

interface CustomerState {
  customers: Customer[];
}

const initialState: CustomerState = {
  customers: null
};

const slice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    getCustomers(
      state: CustomerState,
      action: PayloadAction<{ customers: Customer[] }>
    ) {
      const { customers } = action.payload;
      state.customers = customers;
    },
    addCustomer(
      state: CustomerState,
      action: PayloadAction<{ customer: Customer }>
    ) {
      const { customer } = action.payload;
      state.customers = [...state.customers, customer];
    }
  }
});

export const reducer = slice.reducer;

export const getCustomers = (): AppThunk => async (dispatch) => {
  const customers = await api.get<Customer[]>('customers');
  dispatch(slice.actions.getCustomers({ customers }));
};

export const addCustomer =
  (customer): AppThunk =>
  async (dispatch) => {
    const customerResponse = await api.post<Customer>('customers', customer);
    dispatch(slice.actions.addCustomer({ customer: customerResponse }));
  };

export default slice;