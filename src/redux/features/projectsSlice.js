import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectsApi } from "@/services/api";

// ==================== THUNKS ====================
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (status = null, { rejectWithValue }) => {
    try {
      return await projectsApi.getAll(status);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProject = createAsyncThunk(
  "projects/fetchProject",
  async (id, { rejectWithValue }) => {
    try {
      return await projectsApi.getById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (data, { rejectWithValue }) => {
    try {
      return await projectsApi.create(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await projectsApi.update(id, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const changeProjectStatus = createAsyncThunk(
  "projects/changeStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      await projectsApi.changeStatus(id, status);
      return { id, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await projectsApi.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProjectStats = createAsyncThunk(
  "projects/fetchStats",
  async (id, { rejectWithValue }) => {
    try {
      return await projectsApi.getStats(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const validateProject = createAsyncThunk(
  "projects/validate",
  async (id, { rejectWithValue }) => {
    try {
      return await projectsApi.validate(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ==================== INITIAL STATE ====================
const initialState = {
  projects: [],
  currentProject: null,
  stats: null,
  validation: null,
  loading: false,
  error: null,
};

// ==================== SLICE ====================
export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    
    clearCurrentProject: (state) => {
      state.currentProject = null;
      state.stats = null;
      state.validation = null;
    },
    
    clearValidation: (state) => {
      state.validation = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Fetch all projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single project
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.currentProject = action.payload;
      })
      
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.currentProject = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const idx = state.projects.findIndex(p => p.id === action.payload.id);
        if (idx !== -1) {
          state.projects[idx] = action.payload;
        }
        if (state.currentProject?.id === action.payload.id) {
          state.currentProject = action.payload;
        }
      })
      
      // Change status
      .addCase(changeProjectStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const idx = state.projects.findIndex(p => p.id === id);
        if (idx !== -1) {
          state.projects[idx].status = status;
        }
        if (state.currentProject?.id === id) {
          state.currentProject.status = status;
        }
      })
      
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => p.id !== action.payload);
        if (state.currentProject?.id === action.payload) {
          state.currentProject = null;
        }
      })
      
      // Stats
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      
      // Validation
      .addCase(validateProject.pending, (state) => {
        state.loading = true;
        state.validation = null;
      })
      .addCase(validateProject.fulfilled, (state, action) => {
        state.loading = false;
        state.validation = action.payload;
      })
      .addCase(validateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentProject,
  clearCurrentProject,
  clearValidation,
  clearError,
} = projectsSlice.actions;

export default projectsSlice.reducer;