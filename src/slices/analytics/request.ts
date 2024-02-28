import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import api from '../../utils/api';
import {
  RequestsByMonth,
  RequestStats,
  RequestStatsByPriority
} from '../../models/owns/analytics/request';
import { revertAll } from 'src/utils/redux';

const basePath = 'analytics/requests';
interface RequestStatstate {
  overview: RequestStats;
  requestsByMonth: RequestsByMonth[];
  requestStatsByPriority: RequestStatsByPriority;
  loading: Omit<Record<keyof RequestStatstate, boolean>, 'loading'>;
}
type Operation = keyof RequestStatstate;

const initialState: RequestStatstate = {
  overview: {
    approved: 0,
    pending: 0,
    cancelled: 0,
    cycleTime: 0
  },
  requestStatsByPriority: {
    none: { count: 0 },
    low: { count: 0 },
    medium: { count: 0 },
    high: { count: 0 }
  },
  requestsByMonth: [],
  loading: {
    overview: false,
    requestsByMonth: false,
    requestStatsByPriority: false
  }
};

const slice = createSlice({
  name: 'overviewStats',
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    getOverview(
      state: RequestStatstate,
      action: PayloadAction<{ stats: RequestStats }>
    ) {
      const { stats } = action.payload;
      state.overview = stats;
    },
    getRequestStatsByPriority(
      state: RequestStatstate,
      action: PayloadAction<{ stats: RequestStatsByPriority }>
    ) {
      const { stats } = action.payload;
      state.requestStatsByPriority = stats;
    },
    getRequestsByMonth(
      state: RequestStatstate,
      action: PayloadAction<{ stats: RequestsByMonth[] }>
    ) {
      const { stats } = action.payload;
      state.requestsByMonth = stats;
    },
    setLoading(
      state: RequestStatstate,
      action: PayloadAction<{ loading: boolean; operation: Operation }>
    ) {
      const { loading, operation } = action.payload;
      state.loading[operation] = loading;
    }
  }
});

export const reducer = slice.reducer;

export const getRequestOverview = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'overview',
      loading: true
    })
  );
  const stats = await api.get<RequestStats>(`${basePath}/overview`);
  dispatch(slice.actions.getOverview({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'overview',
      loading: false
    })
  );
};
export const getRequestStatsByPriority = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'requestStatsByPriority',
      loading: true
    })
  );
  const stats = await api.get<RequestStatsByPriority>(`${basePath}/priority`);
  dispatch(slice.actions.getRequestStatsByPriority({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'requestStatsByPriority',
      loading: false
    })
  );
};

export const getRequestsByMonth = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'requestsByMonth',
      loading: true
    })
  );
  const stats = await api.get<RequestsByMonth[]>(
    `${basePath}/cycle-time/month`
  );
  dispatch(slice.actions.getRequestsByMonth({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'requestsByMonth',
      loading: false
    })
  );
};
export default slice;
