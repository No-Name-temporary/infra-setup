import { configureStore } from '@reduxjs/toolkit';
import newtestReducer from '../features/newtest/newtest';
import sideloadsReducer from '../features/sideloads/sideloads';

const store = configureStore({
  reducer: {
    sideloads: sideloadsReducer,
    newtest: newtestReducer,
  },
});

export default store;
