import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import api from '../../utils/api';
import {
  PartConsumptionsByMonth,
  PartStats
} from '../../models/owns/analytics/part';
import { revertAll } from 'src/utils/redux';

const basePath = 'analytics/parts';
interface PartStatstate {
  consumptionsOverview: PartStats;
  partConsumptionsByMonth: PartConsumptionsByMonth[];
  loading: Omit<Record<keyof PartStatstate, boolean>, 'loading'>;
}
type Operation = keyof PartStatstate;

const initialState: PartStatstate = {
  consumptionsOverview: {
    totalConsumptionCost: 0,
    consumedCount: 0
  },
  partConsumptionsByMonth: [],
  loading: {
    consumptionsOverview: false,
    partConsumptionsByMonth: false
  }
};

const slice = createSlice({
  name: 'overviewStats',
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    getOverview(
      state: PartStatstate,
      action: PayloadAction<{ stats: PartStats }>
    ) {
      const { stats } = action.payload;
      state.consumptionsOverview = stats;
    },
    getPartConsumptionsByMonth(
      state: PartStatstate,
      action: PayloadAction<{ stats: PartConsumptionsByMonth[] }>
    ) {
      const { stats } = action.payload;
      state.partConsumptionsByMonth = stats;
    },
    setLoading(
      state: PartStatstate,
      action: PayloadAction<{ loading: boolean; operation: Operation }>
    ) {
      const { loading, operation } = action.payload;
      state.loading[operation] = loading;
    }
  }
});

export const reducer = slice.reducer;

export const getPartConsumptionOverview = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'consumptionsOverview',
      loading: true
    })
  );
  const stats = await api.get<PartStats>(`${basePath}/consumptions/overview`);
  dispatch(slice.actions.getOverview({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'consumptionsOverview',
      loading: false
    })
  );
};
export const getPartConsumptionsByMonth = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'partConsumptionsByMonth',
      loading: true
    })
  );
  const stats = await api.get<PartConsumptionsByMonth[]>(
    `${basePath}/consumptions/month`
  );
  dispatch(slice.actions.getPartConsumptionsByMonth({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'partConsumptionsByMonth',
      loading: false
    })
  );
};

export default slice;
