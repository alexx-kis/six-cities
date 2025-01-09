import { createSlice } from '@reduxjs/toolkit';
import { DataStatus, NameSpace } from '../../const';
import { addToFavoriteAction, fetchNearPlacesAction, removeFromFavoriteAction } from '../api-action';
import { NearPlacesProcess } from '../../types';
import { updateFavoriteStatus } from '../../utils/utils';

// %======================== near-places-process.slice ========================% //

const initialState: NearPlacesProcess = {
  data: [],
  status: DataStatus.Unknown
};

export const nearPlacesProcess = createSlice({
  name: NameSpace.NearPlaces,
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchNearPlacesAction.pending, (state) => {
        state.status = DataStatus.Loading;
      })
      .addCase(fetchNearPlacesAction.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = DataStatus.Loaded;
      })
      .addCase(fetchNearPlacesAction.rejected, (state) => {
        state.status = DataStatus.Error;
      })
      .addCase(addToFavoriteAction.fulfilled, (state, action) => {
        state.data = updateFavoriteStatus(state.data, action.payload, true);
      })
      .addCase(removeFromFavoriteAction.fulfilled, (state, action) => {
        state.data = updateFavoriteStatus(state.data, action.payload, false);
      });
  }
});
