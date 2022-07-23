import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../services/ApiClient';
import { allKeysToCamelCase } from '../../utils/helpers';

const initialState = [];

export const fetchSideloads = createAsyncThunk('sideloads/fetchSideloads', async () => {
  const data = await apiClient.getSideload();
  allKeysToCamelCase(data);
  return data;
});

const sideloadsSlice = createSlice({
  name: 'sideloads',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSideloads.fulfilled, (state, action) => action.payload);
  },
});

export default sideloadsSlice.reducer;
