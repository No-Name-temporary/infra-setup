import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '',
  locations: [],
  minutesBetweenRuns: '',
  type: 'API',
  httpRequest: {
    method: 'GET',
    url: '',
    headers: {},
    body: {},
    assertions: {
      headers: [],
      jsonBody: [],
    },
  },
};

export const newtestSlice = createSlice({
  name: 'newtest',
  initialState,
  reducers: {
    addTitle: (state, action) => {
      state.title = action.payload;
    },
    addMethod: (state, action) => {
      state.httpRequest.method = action.payload;
    },
    addUrl: (state, action) => {
      state.httpRequest.url = action.payload;
    },
    addLocation: (state, action) => {
      state.locations.push(action.payload);
    },
  },
});

export const {
  addTitle, addMethod, addLocation, addUrl,
} = newtestSlice.actions;

export default newtestSlice.reducer;
