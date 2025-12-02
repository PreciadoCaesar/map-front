
// ==================== HELPERS ====================
async function request(endpoint, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Error desconocido" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  // Para respuestas de descarga (blob)
  if (options.blob) {
    return response.blob();
  }

  return response.json();
}

// ==================== PROJECTS ====================
export const projectsApi = {
  getAll: (status = null) => {
    const query = status ? `?status=${status}` : "";
    return request(`/projects/${query}`);
  },

  getById: (id) => request(`/projects/${id}`),

  create: (data) => request("/projects/", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  update: (id, data) => request(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),

  changeStatus: (id, status) => request(`/projects/${id}/status?status=${status}`, {
    method: "PATCH",
  }),

  delete: (id) => request(`/projects/${id}`, { method: "DELETE" }),

  getStats: (id) => request(`/projects/${id}/stats`),

  validate: (id) => request(`/projects/${id}/validate`),
};

// ==================== FEATURES ====================
export const featuresApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.projectId) query.append("project_id", params.projectId);
    if (params.layers) query.append("layers", params.layers.join(","));
    if (params.limit) query.append("limit", params.limit);
    if (params.offset) query.append("offset", params.offset);

    const queryStr = query.toString();
    return request(`/features/${queryStr ? `?${queryStr}` : ""}`);
  },

  getById: (id) => request(`/features/${id}`),

  create: (feature) => request("/features/", {
    method: "POST",
    body: JSON.stringify(feature),
  }),

  createBulk: (features) => request("/features/bulk", {
    method: "POST",
    body: JSON.stringify(features),
  }),

  update: (id, feature) => request(`/features/${id}`, {
    method: "PUT",
    body: JSON.stringify(feature),
  }),

  delete: (id) => request(`/features/${id}`, { method: "DELETE" }),

  deleteBulk: (ids) => request("/features/delete-bulk", {
    method: "POST",
    body: JSON.stringify(ids),
  }),
};

// ==================== SPATIAL QUERIES ====================
export const spatialApi = {
  byPoint: (lng, lat, radiusMeters = 100, projectId = null, layers = null) => {
    let url = `/features/by-point?`;
    if (projectId) url += `project_id=${projectId}&`;
    if (layers) url += `layers=${layers.join(",")}&`;

    return request(url.slice(0, -1), {
      method: "POST",
      body: JSON.stringify({ lng, lat, radius_meters: radiusMeters }),
    });
  },

  byBbox: (minLng, minLat, maxLng, maxLat, projectId = null, layers = null) => {
    let url = `/features/by-bbox?`;
    if (projectId) url += `project_id=${projectId}&`;
    if (layers) url += `layers=${layers.join(",")}&`;

    return request(url.slice(0, -1), {
      method: "POST",
      body: JSON.stringify({ min_lng: minLng, min_lat: minLat, max_lng: maxLng, max_lat: maxLat }),
    });
  },

  byPolygon: (geometry, projectId = null, layers = null) => {
    let url = `/features/by-polygon?`;
    if (projectId) url += `project_id=${projectId}&`;
    if (layers) url += `layers=${layers.join(",")}&`;

    return request(url.slice(0, -1), {
      method: "POST",
      body: JSON.stringify({ geometry }),
    });
  },

  nearby: (featureId, radiusMeters = 50, layers = null) => {
    let url = `/features/${featureId}/nearby?radius=${radiusMeters}`;
    if (layers) url += `&layers=${layers.join(",")}`;
    return request(url);
  },
};

// ==================== EXPORT ====================
export const exportApi = {
  geojson: async (params = {}) => {
    const response = await fetch(`${API_URL}/export/geojson`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return response.blob();
  },

  kml: async (params = {}) => {
    const response = await fetch(`${API_URL}/export/kml`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return response.blob();
  },

  project: async (projectId, format = "geojson") => {
    const response = await fetch(`${API_URL}/export/project/${projectId}?format=${format}`);
    return response.blob();
  },

  // Helper para descargar el blob
  downloadBlob: (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// ==================== IMPORT ====================
export const importApi = {
  geojson: async (projectId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/import/geojson/${projectId}`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  kml: async (projectId, file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/import/kml/${projectId}`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },

  csv: async (projectId, file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);

    const params = new URLSearchParams();
    params.append("lat_column", options.latColumn || "lat");
    params.append("lng_column", options.lngColumn || "lng");
    if (options.nameColumn) params.append("name_column", options.nameColumn);
    if (options.layerColumn) params.append("layer_column", options.layerColumn);

    const response = await fetch(`${API_URL}/import/csv/${projectId}?${params}`, {
      method: "POST",
      body: formData,
    });
    return response.json();
  },
};

// ==================== LAYERS ====================
export const layersApi = {
  getAll: () => request("/layers/"),
};

// ==================== HEALTH ====================
export const healthApi = {
  check: () => request("/health"),
};

export default {
  projects: projectsApi,
  features: featuresApi,
  spatial: spatialApi,
  export: exportApi,
  import: importApi,
  layers: layersApi,
  health: healthApi,
};