// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./Foodslice";

const store = configureStore({
  reducer: {
    item: itemReducer,
  },
});

export default store;

