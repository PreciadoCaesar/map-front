import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mapBoxDrawStateRef: null,
  mapRef: null,
  activeLayer: null,
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
  }
});

export const {
  setMapboxDrawRef,
  setMapref,
  setActiveLayer,
} = mapSlice.actions;

export default mapSlice.reducer;
