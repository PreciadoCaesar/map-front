import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:8000';

// Thunks para cargar las capas
export const fetchDepartamentos = createAsyncThunk(
    'geographic/fetchDepartamentos',
    async () => {
        const response = await fetch(`${API_BASE}/geo/departamentos`);
        if (!response.ok) throw new Error('Error cargando departamentos');
        return await response.json();
    }
);

export const fetchProvincias = createAsyncThunk(
    'geographic/fetchProvincias',
    async () => {
        const response = await fetch(`${API_BASE}/geo/provincias`);
        if (!response.ok) throw new Error('Error cargando provincias');
        return await response.json();
    }
);

export const fetchDistritos = createAsyncThunk(
    'geographic/fetchDistritos',
    async () => {
        const response = await fetch(`${API_BASE}/geo/distritos`);
        if (!response.ok) throw new Error('Error cargando distritos');
        return await response.json();
    }
);

const geographicSlice = createSlice({
    name: 'geographic',
    initialState: {
        departamentos: null,
        provincias: null,
        distritos: null,
        loading: {
            departamentos: false,
            provincias: false,
            distritos: false,
        },
        visibility: {
            departamentos: true,
            provincias: false,
            distritos: false,
        },
        error: null,
    },
    reducers: {
        toggleLayerVisibility: (state, action) => {
            const layer = action.payload;
            state.visibility[layer] = !state.visibility[layer];
        },
        setLayerVisibility: (state, action) => {
            const { layer, visible } = action.payload;
            state.visibility[layer] = visible;
        },
    },
    extraReducers: (builder) => {
        // Departamentos
        builder.addCase(fetchDepartamentos.pending, (state) => {
            state.loading.departamentos = true;
        });
        builder.addCase(fetchDepartamentos.fulfilled, (state, action) => {
            state.loading.departamentos = false;
            state.departamentos = action.payload;
        });
        builder.addCase(fetchDepartamentos.rejected, (state, action) => {
            state.loading.departamentos = false;
            state.error = action.error.message;
        });

        // Provincias
        builder.addCase(fetchProvincias.pending, (state) => {
            state.loading.provincias = true;
        });
        builder.addCase(fetchProvincias.fulfilled, (state, action) => {
            state.loading.provincias = false;
            state.provincias = action.payload;
        });
        builder.addCase(fetchProvincias.rejected, (state, action) => {
            state.loading.provincias = false;
            state.error = action.error.message;
        });

        // Distritos
        builder.addCase(fetchDistritos.pending, (state) => {
            state.loading.distritos = true;
        });
        builder.addCase(fetchDistritos.fulfilled, (state, action) => {
            state.loading.distritos = false;
            state.distritos = action.payload;
        });
        builder.addCase(fetchDistritos.rejected, (state, action) => {
            state.loading.distritos = false;
            state.error = action.error.message;
        });
    },
});

export const { toggleLayerVisibility, setLayerVisibility } = geographicSlice.actions;
export default geographicSlice.reducer;
