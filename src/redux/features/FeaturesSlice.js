import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * URL base de la API
 * Se obtiene de las variables de entorno o usa localhost por defecto
 */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Timeout para las peticiones fetch (en milise gundos)
 */
const FETCH_TIMEOUT = 30000; // 30 segundos

/**
 * Realiza una petición fetch con timeout
 * @param {string} url - URL de la petición
 * @param {Object} options - Opciones de fetch
 * @param {number} timeout - Timeout en milisegundos
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeout = FETCH_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('La petición ha excedido el tiempo de espera');
    }
    throw error;
  }
}

/**
 * Maneja errores de respuesta HTTP
 * @param {Response} response - Respuesta de fetch
 * @returns {Promise<Response>}
 * @throws {Error} Si la respuesta no es OK
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Si no se puede parsear el error, usar el mensaje por defecto
    }
    
    throw new Error(errorMessage);
  }
  
  return response;
}

/**
 * Obtiene todos los features del backend
 * @param {number|null} projectId - ID del proyecto (opcional)
 * @returns {Promise<Array>} Array de features
 */
export const fetchFeatures = createAsyncThunk(
  "features/fetchFeatures",
  async (projectId = null, { rejectWithValue }) => {
    try {
      const url = projectId 
        ? `${API_URL}/features/?project_id=${projectId}` 
        : `${API_URL}/features/`;
      
      const response = await fetchWithTimeout(url);
      await handleResponse(response);
      
      const data = await response.json();
      
      // Validar estructura de respuesta
      if (!data || typeof data !== 'object') {
        throw new Error('Respuesta inválida del servidor');
      }
      
      // Tu backend devuelve {"type": "FeatureCollection", "features": [...], "total_count": X}
      const features = data.features || [];
      
      if (!Array.isArray(features)) {
        throw new Error('El campo features debe ser un array');
      }
      
      return features;
    } catch (error) {
      console.error('Error fetching features:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Crea un nuevo feature
 * @param {Object} feature - Feature en formato GeoJSON
 * @returns {Promise<Object>} Feature creado
 */
export const createFeature = createAsyncThunk(
  "features/createFeature",
  async (feature, { rejectWithValue }) => {
    try {
      if (!feature || !feature.geometry || !feature.properties) {
        throw new Error('Feature inválido: debe tener geometry y properties');
      }

      const response = await fetchWithTimeout(`${API_URL}/features/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feature),
      });
      
      await handleResponse(response);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error creating feature:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Actualiza un feature existente
 * @param {Object} params
 * @param {string|number} params.id - ID del feature
 * @param {Object} params.feature - Feature actualizado
 * @returns {Promise<Object>} Feature actualizado
 */
export const updateFeature = createAsyncThunk(
  "features/updateFeature",
  async ({ id, feature }, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID del feature es requerido');
      }

      if (!feature || !feature.geometry || !feature.properties) {
        throw new Error('Feature inválido: debe tener geometry y properties');
      }

      const response = await fetchWithTimeout(`${API_URL}/features/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feature),
      });
      
      await handleResponse(response);
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error('Error updating feature:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Elimina un feature
 * @param {string|number} id - ID del feature
 * @returns {Promise<string|number>} ID del feature eliminado
 */
export const deleteFeature = createAsyncThunk(
  "features/deleteFeature",
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('ID del feature es requerido');
      }

      const response = await fetchWithTimeout(`${API_URL}/features/${id}`, {
        method: "DELETE",
      });
      
      await handleResponse(response);
      
      return id;
    } catch (error) {
      console.error('Error deleting feature:', error);
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Estado inicial del slice
 */
const initialState = {
  features: [],
  loading: false,
  error: null,
  // Estados para operaciones individuales
  creating: false,
  updating: false,
  deleting: false,
};

/**
 * Slice de Redux para features
 */
export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    /**
     * Limpia el error del estado
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Resetea el estado a su valor inicial
     */
    resetFeatures: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ========== FETCH FEATURES ==========
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.features = action.payload;
        state.error = null;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // ========== CREATE FEATURE ==========
      .addCase(createFeature.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createFeature.fulfilled, (state, action) => {
        state.creating = false;
        state.features.push(action.payload);
        state.error = null;
      })
      .addCase(createFeature.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload || action.error.message;
      })

      // ========== UPDATE FEATURE ==========
      .addCase(updateFeature.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        state.updating = false;
        
        const updatedFeature = action.payload;
        const featureId = updatedFeature.properties?.feature_id || updatedFeature.id;
        
        const index = state.features.findIndex(
          (f) => (f.properties?.feature_id || f.id) === featureId
        );
        
        if (index !== -1) {
          state.features[index] = updatedFeature;
        } else {
          console.warn(`Feature con ID ${featureId} no encontrado para actualizar`);
        }
        
        state.error = null;
      })
      .addCase(updateFeature.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || action.error.message;
      })

      // ========== DELETE FEATURE ==========
      .addCase(deleteFeature.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.deleting = false;
        
        const deletedId = action.payload;
        state.features = state.features.filter(
          (f) => (f.properties?.feature_id || f.id) !== deletedId
        );
        
        state.error = null;
      })
      .addCase(deleteFeature.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Exportar actions
export const { clearError, resetFeatures } = featuresSlice.actions;

// Selectores
export const selectFeatures = (state) => state.features.features;
export const selectFeaturesLoading = (state) => state.features.loading;
export const selectFeaturesError = (state) => state.features.error;
export const selectIsCreating = (state) => state.features.creating;
export const selectIsUpdating = (state) => state.features.updating;
export const selectIsDeleting = (state) => state.features.deleting;

// Exportar reducer
export default featuresSlice.reducer;
