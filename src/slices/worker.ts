import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import { Worker } from '../models/owns/worker';
import api from '../utils/api';

interface WorkerState {
  workers: Worker[];
}

const initialState: WorkerState = {
  workers: []
};

const slice = createSlice({
  name: 'workers',
  initialState,
  reducers: {
    getWorkers(
      state: WorkerState,
      action: PayloadAction<{ workers: Worker[] }>
    ) {
      const { workers } = action.payload;
      state.workers = workers;
    }
  }
});

export const reducer = slice.reducer;

export const getWorkers = (): AppThunk => async (dispatch) => {
  const workers = await api.get<Worker[]>('workers');
  dispatch(slice.actions.getWorkers({ workers }));
};

export default slice;
