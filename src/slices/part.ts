import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { AppThunk } from 'src/store';
import Part from '../models/owns/part';
import api from '../utils/api';

const basePath = 'parts';
interface PartState {
  parts: Part[];
}

const initialState: PartState = {
  parts: []
};

const slice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    getParts(state: PartState, action: PayloadAction<{ parts: Part[] }>) {
      const { parts } = action.payload;
      state.parts = parts;
    },
    addPart(state: PartState, action: PayloadAction<{ part: Part }>) {
      const { part } = action.payload;
      state.parts = [...state.parts, part];
    },
    editPart(state: PartState, action: PayloadAction<{ part: Part }>) {
      const { part } = action.payload;
      state.parts = state.parts.map((part1) => {
        if (part1.id === part.id) {
          return part;
        }
        return part1;
      });
    },
    deletePart(state: PartState, action: PayloadAction<{ id: number }>) {
      const { id } = action.payload;
      const partIndex = state.parts.findIndex((part) => part.id === id);
      state.parts.splice(partIndex, 1);
    }
  }
});

export const reducer = slice.reducer;

export const getParts = (): AppThunk => async (dispatch) => {
  const parts = await api.get<Part[]>(basePath);
  dispatch(slice.actions.getParts({ parts }));
};

export const addPart =
  (part): AppThunk =>
  async (dispatch) => {
    const partResponse = await api.post<Part>(basePath, part);
    dispatch(slice.actions.addPart({ part: partResponse }));
  };
export const editPart =
  (id: number, part): AppThunk =>
  async (dispatch) => {
    const partResponse = await api.patch<Part>(`${basePath}/${id}`, part);
    dispatch(slice.actions.editPart({ part: partResponse }));
  };
export const deletePart =
  (id: number): AppThunk =>
  async (dispatch) => {
    const partResponse = await api.deletes<{ success: boolean }>(
      `${basePath}/${id}`
    );
    const { success } = partResponse;
    if (success) {
      dispatch(slice.actions.deletePart({ id }));
    }
  };

export default slice;
