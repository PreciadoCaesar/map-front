import * as turf from "@turf/turf";

/**
 * Calcula la longitud de una línea y obtiene el punto medio para mostrar la etiqueta
 * @param {Object} feature - GeoJSON Feature de tipo LineString
 * @returns {Object} { lineLength: number (metros), coordinates: [lon, lat] }
 */
export const distanceLine = (feature) => {
  try {
    // Validar que sea una geometría válida
    if (!feature || !feature.geometry || !feature.geometry.coordinates) {
      throw new Error("Feature inválida: falta geometría o coordenadas");
    }

    // Validar que sea LineString
    if (feature.geometry.type !== "LineString") {
      throw new Error(`Tipo de geometría inválido: esperado LineString, recibido ${feature.geometry.type}`);
    }

    // Validar que tenga al menos 2 puntos
    const coords = feature.geometry.coordinates;
    if (coords.length < 2) {
      throw new Error("La línea debe tener al menos 2 puntos");
    }

    // Calcular longitud en metros (turf.length usa km por defecto)
    const lineLength = turf.length(feature, { units: "meters" });

    // Obtener el punto medio de la línea para mostrar la etiqueta
    const midpoint = turf.midpoint(
      turf.point(coords[0]),
      turf.point(coords[coords.length - 1])
    );
    const coordinates = midpoint.geometry.coordinates;

    return { 
      lineLength, 
      coordinates,
      // Datos adicionales útiles
      formattedLength: formatDistance(lineLength),
      pointCount: coords.length
    };
  } catch (error) {
    console.error("Error calculando distancia de línea:", error);
    return { 
      lineLength: 0, 
      coordinates: null, 
      formattedLength: "Error",
      error: error.message 
    };
  }
};

/**
 * Calcula el área y perímetro de un polígono
 * @param {Object} feature - GeoJSON Feature de tipo Polygon
 * @returns {Object} { polygonArea: number (m²), perimeter: number (m), coordinates: [lon, lat] }
 */
export const areaHelper = (feature) => {
  try {
    // Validar que sea una geometría válida
    if (!feature || !feature.geometry || !feature.geometry.coordinates) {
      throw new Error("Feature inválida: falta geometría o coordenadas");
    }

    // Validar que sea Polygon
    if (feature.geometry.type !== "Polygon") {
      throw new Error(`Tipo de geometría inválido: esperado Polygon, recibido ${feature.geometry.type}`);
    }

    // Calcular área en metros cuadrados (turf.area retorna m² por defecto)
    const polygonArea = turf.area(feature);

    // Calcular perímetro en metros
    const perimeter = turf.length(turf.polygonToLine(feature), { units: "meters" });

    // Obtener punto dentro del polígono para mostrar la etiqueta
    const pointOnPolygon = turf.pointOnFeature(feature);
    const coordinates = pointOnPolygon.geometry.coordinates;

    return { 
      polygonArea, 
      perimeter,
      coordinates,
      // Datos adicionales útiles
      formattedArea: formatArea(polygonArea),
      formattedPerimeter: formatDistance(perimeter)
    };
  } catch (error) {
    console.error("Error calculando área de polígono:", error);
    return { 
      polygonArea: 0, 
      perimeter: 0,
      coordinates: null,
      formattedArea: "Error",
      formattedPerimeter: "Error",
      error: error.message 
    };
  }
};

/**
 * Formatea una distancia en metros para mostrar al usuario
 * @param {number} meters - Distancia en metros
 * @returns {string} Distancia formateada (ej: "150 m" o "1.5 km")
 */
export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${meters.toFixed(2)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
};

/**
 * Formatea un área en metros cuadrados para mostrar al usuario
 * @param {number} squareMeters - Área en metros cuadrados
 * @returns {string} Área formateada (ej: "500 m²" o "1.5 km²" o "2.5 ha")
 */
export const formatArea = (squareMeters) => {
  if (squareMeters < 10000) {
    // Menos de 1 hectárea
    return `${squareMeters.toFixed(2)} m²`;
  } else if (squareMeters < 1000000) {
    // Entre 1 hectárea y 1 km²
    const hectares = squareMeters / 10000;
    return `${hectares.toFixed(2)} ha`;
  } else {
    // Más de 1 km²
    const squareKm = squareMeters / 1000000;
    return `${squareKm.toFixed(2)} km²`;
  }
};

/**
 * Valida si una feature es válida para medición
 * @param {Object} feature - GeoJSON Feature
 * @param {string[]} allowedTypes - Tipos de geometría permitidos
 * @returns {boolean} true si es válida
 */
export const isValidFeature = (feature, allowedTypes = ["LineString", "Polygon"]) => {
  if (!feature || !feature.geometry || !feature.geometry.coordinates) {
    return false;
  }
  return allowedTypes.includes(feature.geometry.type);
};
