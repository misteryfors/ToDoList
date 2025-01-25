import { configureStore } from '@reduxjs/toolkit';
import StorageReducer from './StorageReducer.ts';

const store=configureStore({
  reducer:{
    ToDoStorage:StorageReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export default store;