import { combineReducers, configureStore } from "@reduxjs/toolkit";
import taskReducer from "../slices/taskSlice";

const rootReducer = combineReducers({
  tasks: taskReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>; // Define RootState type

export default store;