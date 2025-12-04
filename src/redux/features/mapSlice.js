import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mapBoxDrawStateRef: null,
  mapRef: null,
  activeLayer: null,
  measureMode: null, // 'distance' | 'area' | null
};

export const mapSlice = createSlice({
  name: "mapSlice",
  initialState,
  reducers: {
    setMapboxDrawRef: (state, action) => {
      state.mapBoxDrawStateRef = action.payload;
    },
    setMapref: (state, action) => {
      state.mapRef = action.payload;
    },
    setActiveLayer: (state, action) => {
      state.activeLayer = action.payload;
    },
    setMeasureMode: (state, action) => {
      state.measureMode = action.payload; // 'distance' | 'area' | null
    },
  }
});

export const {
  setMapboxDrawRef,
  setMapref,
  setActiveLayer,
  setMeasureMode,
} = mapSlice.actions;

export default mapSlice.reducer;
