import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "@/redux/features/mapSlice";
import featuresReducer from "@/redux/features/FeaturesSlice";

export const store = configureStore({
  reducer: {
    mapReducer,
    featuresReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
