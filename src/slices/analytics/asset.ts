import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import api from '../../utils/api';
import {
  AssetOverviewStats,
  AssetsCost,
  DowntimesAndCostsByAsset,
  DowntimesByAsset,
  DowntimesByMonth,
  DowntimesMeantimeByMonth,
  Meantimes,
  RepairTimeByAsset,
  TimeCostByAsset
} from '../../models/owns/analytics/asset';
import { revertAll } from 'src/utils/redux';

const basePath = 'analytics/assets';
interface AssetStatstate {
  overview: AssetOverviewStats;
  completeTimeCostByAsset: TimeCostByAsset[];
  downtimesByAsset: DowntimesByAsset[];
  assetsCosts: AssetsCost;
  downtimesAndCostsByAsset: DowntimesAndCostsByAsset[];
  downtimesByMonth: DowntimesByMonth[];
  downtimesMeantimeByMonth: DowntimesMeantimeByMonth[];
  meantimes: Meantimes;
  repairTimeByAsset: RepairTimeByAsset[];
  loading: Omit<Record<keyof AssetStatstate, boolean>, 'loading'>;
}
type Operation = keyof AssetStatstate;

const initialState: AssetStatstate = {
  completeTimeCostByAsset: [],
  overview: {
    downtime: 0,
    availability: 100,
    downtimeEvents: 0
  },
  downtimesByAsset: [],
  assetsCosts: {
    rav: 0,
    totalWOCosts: 0,
    totalAcquisitionCost: 0
  },
  downtimesAndCostsByAsset: [],
  downtimesByMonth: [],
  downtimesMeantimeByMonth: [],
  meantimes: { betweenDowntimes: 0, betweenMaintenances: 0 },
  repairTimeByAsset: [],
  loading: {
    completeTimeCostByAsset: false,
    overview: false,
    downtimesByAsset: false,
    assetsCosts: false,
    downtimesAndCostsByAsset: false,
    downtimesByMonth: false,
    downtimesMeantimeByMonth: false,
    meantimes: false,
    repairTimeByAsset: false
  }
};

const slice = createSlice({
  name: 'overviewStats',
  initialState,
  extraReducers: (builder) => builder.addCase(revertAll, () => initialState),
  reducers: {
    getWOTimeCostByAsset(
      state: AssetStatstate,
      action: PayloadAction<{ stats: TimeCostByAsset[] }>
    ) {
      const { stats } = action.payload;
      state.completeTimeCostByAsset = stats;
    },
    getOverview(
      state: AssetStatstate,
      action: PayloadAction<{ stats: AssetOverviewStats }>
    ) {
      const { stats } = action.payload;
      state.overview = stats;
    },
    getAssetsCosts(
      state: AssetStatstate,
      action: PayloadAction<{ stats: AssetsCost }>
    ) {
      const { stats } = action.payload;
      state.assetsCosts = stats;
    },
    getMeantimes(
      state: AssetStatstate,
      action: PayloadAction<{ stats: Meantimes }>
    ) {
      const { stats } = action.payload;
      state.meantimes = stats;
    },
    getDowntimesByAsset(
      state: AssetStatstate,
      action: PayloadAction<{ stats: DowntimesByAsset[] }>
    ) {
      const { stats } = action.payload;
      state.downtimesByAsset = stats;
    },
    getDowntimesAndCostsByAsset(
      state: AssetStatstate,
      action: PayloadAction<{ stats: DowntimesAndCostsByAsset[] }>
    ) {
      const { stats } = action.payload;
      state.downtimesAndCostsByAsset = stats;
    },
    getDowntimesByMonth(
      state: AssetStatstate,
      action: PayloadAction<{ stats: DowntimesByMonth[] }>
    ) {
      const { stats } = action.payload;
      state.downtimesByMonth = stats;
    },
    getDowntimesMeantimeByMonth(
      state: AssetStatstate,
      action: PayloadAction<{ stats: DowntimesMeantimeByMonth[] }>
    ) {
      const { stats } = action.payload;
      state.downtimesMeantimeByMonth = stats;
    },
    getRepairTimeByAsset(
      state: AssetStatstate,
      action: PayloadAction<{ stats: RepairTimeByAsset[] }>
    ) {
      const { stats } = action.payload;
      state.repairTimeByAsset = stats;
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
export const getAssetOverview = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'overview',
      loading: true
    })
  );
  const stats = await api.get<AssetOverviewStats>(`${basePath}/overview`);
  dispatch(slice.actions.getOverview({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'overview',
      loading: false
    })
  );
};
export const getAssetsCosts = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'assetsCosts',
      loading: true
    })
  );
  const stats = await api.get<AssetsCost>(`${basePath}/costs/overview`);
  dispatch(slice.actions.getAssetsCosts({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'assetsCosts',
      loading: false
    })
  );
};
export const getMeantimes = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'meantimes',
      loading: true
    })
  );
  const stats = await api.get<Meantimes>(`${basePath}/meantimes`);
  dispatch(slice.actions.getMeantimes({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'meantimes',
      loading: false
    })
  );
};
export const getDowntimesByAsset = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesByAsset',
      loading: true
    })
  );
  const stats = await api.get<DowntimesByAsset[]>(`${basePath}/downtimes`);
  dispatch(slice.actions.getDowntimesByAsset({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesByAsset',
      loading: false
    })
  );
};
export const getDowntimesAndCostsByAsset = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesAndCostsByAsset',
      loading: true
    })
  );
  const stats = await api.get<DowntimesAndCostsByAsset[]>(
    `${basePath}/downtimes/costs`
  );
  dispatch(slice.actions.getDowntimesAndCostsByAsset({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesAndCostsByAsset',
      loading: false
    })
  );
};
export const getDowntimesByMonth = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesByMonth',
      loading: true
    })
  );
  const stats = await api.get<DowntimesByMonth[]>(
    `${basePath}/downtimes/costs/month`
  );
  dispatch(slice.actions.getDowntimesByMonth({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesByMonth',
      loading: false
    })
  );
};
export const getDowntimesMeantimeByMonth = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesMeantimeByMonth',
      loading: true
    })
  );
  const stats = await api.get<DowntimesMeantimeByMonth[]>(
    `${basePath}/downtimes/meantime/month`
  );
  dispatch(slice.actions.getDowntimesMeantimeByMonth({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'downtimesMeantimeByMonth',
      loading: false
    })
  );
};
export const getRepairTimeByAsset = (): AppThunk => async (dispatch) => {
  dispatch(
    slice.actions.setLoading({
      operation: 'repairTimeByAsset',
      loading: true
    })
  );
  const stats = await api.get<RepairTimeByAsset[]>(`${basePath}/repair-times`);
  dispatch(slice.actions.getRepairTimeByAsset({ stats }));
  dispatch(
    slice.actions.setLoading({
      operation: 'repairTimeByAsset',
      loading: false
    })
  );
};
export default slice;
