import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import api from '../../utils/api';
import { TimeCostByAsset } from '../../models/owns/analytics/asset';

const basePath = 'analytics/assets';
interface AssetStatstate {
  completeTimeCostByAsset: TimeCostByAsset[];
  loading: Omit<Record<keyof AssetStatstate, boolean>, 'loading'>;
}
type Operation = keyof AssetStatstate;

const initialState: AssetStatstate = {
  completeTimeCostByAsset: [],
  loading: {
    completeTimeCostByAsset: false
  }
};

const slice = createSlice({
  name: 'overviewStats',
  initialState,
  reducers: {
    getWOTimeCostByAsset(
      state: AssetStatstate,
      action: PayloadAction<{ stats: TimeCostByAsset[] }>
    ) {
      const { stats } = action.payload;
      state.completeTimeCostByAsset = stats;
    },
    setLoading(
      state: AssetStatstate,
      action: PayloadAction<{ loading: boolean; operation: Operation }>
    ) {
      const { loading, operation } = action.payload;
      state.loading[operation] = loading;
    }
  }
});

export const reducer = slice.reducer;

export const getWOTimeCostByAsset = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'completeTimeCostByAsset',
      loading: true
    })
  );
  const stats = await api.get<TimeCostByAsset[]>(`${basePath}/time-cost`);
  dispatch(slice.actions.getWOTimeCostByAsset({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'completeTimeCostByAsset',
      loading: false
    })
  );
};
export default slice;
