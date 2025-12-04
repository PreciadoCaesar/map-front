import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "@/redux/features/mapSlice";
import featuresReducer from "@/redux/features/FeaturesSlice";
import geographicReducer from "@/redux/features/geographicSlice";  // ← AGREGAR ESTA LÍNEA

export const store = configureStore({
  reducer: {
    mapReducer,
    featuresReducer,
    geographicReducer,  // Ahora sí está importado
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
