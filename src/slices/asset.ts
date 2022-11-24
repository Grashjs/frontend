import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import { AssetDTO, AssetRow } from '../models/owns/asset';
import api from '../utils/api';
import WorkOrder from '../models/owns/workOrder';

const basePath = 'assets';
interface AssetState {
  assets: AssetDTO[];
  assetsHierarchy: AssetRow[];
  assetInfos: { [key: number]: { asset?: AssetDTO; workOrders: WorkOrder[] } };
}

const initialState: AssetState = {
  assets: [],
  assetsHierarchy: [],
  assetInfos: {}
};

const slice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    getAssets(
      state: AssetState,
      action: PayloadAction<{ assets: AssetDTO[] }>
    ) {
      const { assets } = action.payload;
      state.assets = assets;
    },
    addAsset(state: AssetState, action: PayloadAction<{ asset: AssetDTO }>) {
      const { asset } = action.payload;
      state.assets = [...state.assets, asset];
    },
    editAsset(state: AssetState, action: PayloadAction<{ asset: AssetDTO }>) {
      const { asset } = action.payload;
      state.assets = state.assets.map((asset1) => {
        if (asset1.id === asset.id) {
          return asset;
        }
        return asset1;
      });
    },
    deleteAsset(state: AssetState, action: PayloadAction<{ id: number }>) {
      const { id } = action.payload;
      const assetIndex = state.assets.findIndex((asset) => asset.id === id);
      state.assets.splice(assetIndex, 1);
    },
    getAssetChildren(
      state: AssetState,
      action: PayloadAction<{ assets: AssetRow[]; id: number }>
    ) {
      const { assets, id } = action.payload;
      const parent = state.assetsHierarchy.findIndex(
        (asset) => asset.id === id
      );
      if (parent !== -1) state.assetsHierarchy[parent].childrenFetched = true;

      state.assetsHierarchy = assets.reduce((acc, asset) => {
        //check if asset already exists in state
        const assetInState = state.assetsHierarchy.findIndex(
          (asset1) => asset1.id === asset.id
        );
        //not found
        if (assetInState === -1) return [...acc, asset];
        //found
        acc[assetInState] = asset;
        return acc;
      }, state.assetsHierarchy);
    },
    getAssetDetails(
      state: AssetState,
      action: PayloadAction<{ asset: AssetDTO; id: number }>
    ) {
      const { asset, id } = action.payload;
      if (state.assetInfos[id]) {
        state.assetInfos[id] = { ...state.assetInfos[id], asset };
      } else state.assetInfos[id] = { asset, workOrders: [] };
    },
    getAssetWorkOrders(
      state: AssetState,
      action: PayloadAction<{ workOrders: WorkOrder[]; id: number }>
    ) {
      const { workOrders, id } = action.payload;
      if (state.assetInfos[id]) {
        state.assetInfos[id] = { ...state.assetInfos[id], workOrders };
      } else state.assetInfos[id] = { workOrders };
    }
  }
});

export const reducer = slice.reducer;

export const getAssets = (): AppThunk => async (dispatch) => {
  const assets = await api.get<AssetDTO[]>(basePath);
  dispatch(slice.actions.getAssets({ assets }));
};

export const addAsset =
  (asset): AppThunk =>
  async (dispatch) => {
    const assetResponse = await api.post<AssetDTO>(basePath, asset);
    dispatch(slice.actions.addAsset({ asset: assetResponse }));
  };
export const editAsset =
  (id: number, asset): AppThunk =>
  async (dispatch) => {
    const assetResponse = await api.patch<AssetDTO>(`${basePath}/${id}`, asset);
    dispatch(slice.actions.editAsset({ asset: assetResponse }));
  };
export const deleteAsset =
  (id: number): AppThunk =>
  async (dispatch) => {
    const assetResponse = await api.deletes<{ success: boolean }>(
      `${basePath}/${id}`
    );
    const { success } = assetResponse;
    if (success) {
      dispatch(slice.actions.deleteAsset({ id }));
    }
  };

export const getAssetChildren =
  (id: number, parents: number[]): AppThunk =>
  async (dispatch) => {
    const assets = await api.get<AssetDTO[]>(`${basePath}/children/${id}`);
    dispatch(
      slice.actions.getAssetChildren({
        id,
        assets: assets.map((asset) => {
          return { ...asset, hierarchy: [...parents, asset.id] };
        })
      })
    );
  };

export const getAssetDetails =
  (id: number): AppThunk =>
  async (dispatch) => {
    const asset = await api.get<AssetDTO>(`${basePath}/${id}`);
    dispatch(
      slice.actions.getAssetDetails({
        id,
        asset
      })
    );
  };
export const getAssetWorkOrders =
  (id: number): AppThunk =>
  async (dispatch) => {
    const workOrders = await api.get<WorkOrder[]>(`work-orders/asset/${id}`);
    dispatch(
      slice.actions.getAssetWorkOrders({
        id,
        workOrders
      })
    );
  };
export default slice;
