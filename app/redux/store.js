"use client";

import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import partsReducer from "./features/partsSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["parts", "userParts", "allParts", "postalCode"],
};

const persistedReducer = persistReducer(persistConfig, partsReducer);

export const store = configureStore({
  reducer: {
    parts: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
