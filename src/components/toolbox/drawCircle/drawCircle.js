import * as turf from "@turf/turf";

// Constantes
const CIRCLE_STEPS = 170; // Número de pasos para suavidad del círculo
const DEFAULT_UNITS = 'kilometers';

/**
 * Utilitario para manejar el zoom por doble clic en el mapa
 * Deshabilitado durante el dibujo para evitar conflictos
 */
const handleDoubleClickZoom = {
  /**
   * Habilita el zoom por doble clic
   * setTimeout necesario para evitar race conditions con eventos de Draw
   */
  enable(ctx) {
    setTimeout(() => {
      try {
        if (ctx?.map?.doubleClickZoom) {
          ctx.map.doubleClickZoom.enable();
        }
      } catch (error) {
        console.warn('Error habilitando doubleClickZoom:', error);
      }
    }, 0);
  },

  /**
   * Deshabilita el zoom por doble clic
   */
  disable(ctx) {
    setTimeout(() => {
      try {
        if (ctx?.map?.doubleClickZoom) {
          ctx.map.doubleClickZoom.disable();
        }
      } catch (error) {
        console.warn('Error deshabilitando doubleClickZoom:', error);
      }
    }, 0);
  }
};

/**
 * Valida que las coordenadas sean válidas
 * @param {Array<number>} coords - [lng, lat]
 * @returns {boolean}
 */
const isValidCoordinates = (coords) => {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  const [lng, lat] = coords;
  return (
    typeof lng === 'number' &&
    typeof lat === 'number' &&
    lng >= -180 &&
    lng <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
};

/**
 * Modo personalizado de Mapbox GL Draw para crear círculos
 * mediante arrastre (click para centro, segundo click para radio)
 * 
 * @see https://github.com/mapbox/mapbox-gl-draw/blob/main/docs/MODES.md
 */
const DragCircleMode = {
  /**
   * Inicializa el modo cuando se activa
   * @returns {Object} Estado inicial del modo
   */
  onSetup() {
    const polygon = this.newFeature({
      type: "Feature",
      properties: {
        isCircle: true,
        center: [],
        radiusInKm: 0
      },
      geometry: {
        type: "Polygon",
        coordinates: []
      }
    });

    this.addFeature(polygon);
    handleDoubleClickZoom.disable(this);
    this.updateUIClasses({ mouse: "crosshair" });
    this.setActionableState({ trash: true });

    return {
      polygon,
      currentVertexPosition: 0
    };
  },

  /**
   * Maneja el movimiento del mouse para previsualizar el círculo
   * @param {Object} state - Estado actual del modo
   * @param {Object} e - Evento del mouse
   */
  onMouseMove(state, e) {
    const center = state.polygon.properties.center;
    
    // Si no hay centro definido, no hacer nada
    if (!center || center.length === 0) {
      return;
    }

    try {
      const currentPoint = [e.lngLat.lng, e.lngLat.lat];

      // Validar coordenadas
      if (!isValidCoordinates(center) || !isValidCoordinates(currentPoint)) {
        console.warn('Coordenadas inválidas detectadas');
        return;
      }

      // Calcular distancia entre centro y punto actual
      const distance = turf.distance(
        turf.point(center),
        turf.point(currentPoint),
        { units: DEFAULT_UNITS }
      );

      // Evitar círculos demasiado pequeños
      if (distance < 0.001) {
        return;
      }

      // Generar círculo
      const circle = turf.circle(center, distance, {
        steps: CIRCLE_STEPS,
        units: DEFAULT_UNITS
      });

      // Actualizar geometría del polígono
      state.polygon.incomingCoords(circle.geometry.coordinates);
      state.polygon.properties.radiusInKm = distance;
    } catch (error) {
      console.error('Error calculando círculo:', error);
    }
  },

  /**
   * Maneja el click del mouse
   * Primer click: define centro
   * Segundo click: finaliza el círculo
   * @param {Object} state - Estado actual del modo
   * @param {Object} e - Evento del click
   */
  onClick(state, e) {
    const center = state.polygon.properties.center;
    const currentPoint = [e.lngLat.lng, e.lngLat.lat];

    // Validar coordenadas
    if (!isValidCoordinates(currentPoint)) {
      console.warn('Coordenadas inválidas:', currentPoint);
      return;
    }

    // Primer click: establecer centro
    if (!center || center.length === 0) {
      state.polygon.properties.center = currentPoint;
      this.updateUIClasses({ mouse: "add" });
    } 
    // Segundo click: finalizar círculo
    else {
      // Validar que el círculo tenga un radio mínimo
      if (state.polygon.properties.radiusInKm < 0.001) {
        console.warn('Radio del círculo demasiado pequeño');
        return;
      }

      this.changeMode("simple_select", {
        featureIds: [state.polygon.id]
      });
    }
  },

  /**
   * Maneja la tecla Escape para cancelar el dibujo
   * @param {Object} state - Estado actual del modo
   * @param {Object} e - Evento del teclado
   */
  onKeyUp(state, e) {
    if (e.keyCode === 27) { // Escape
      this.deleteFeature([state.polygon.id], { silent: true });
      this.changeMode("simple_select");
    }
  },

  /**
   * Limpieza al salir del modo
   * @param {Object} state - Estado actual del modo
   */
  onStop(state) {
    handleDoubleClickZoom.enable(this);
    this.updateUIClasses({ mouse: "none" });

    // Validar y emitir evento de creación si el círculo es válido
    if (state.polygon.isValid() && state.polygon.properties.radiusInKm > 0) {
      this.map.fire("draw.create", {
        features: [state.polygon.toGeoJSON()]
      });
    } else {
      // Eliminar el feature si no es válido
      this.deleteFeature([state.polygon.id], { silent: true });
    }
  },

  /**
   * Personaliza la visualización del feature durante el dibujo
   * @param {Object} state - Estado actual del modo
   * @param {Object} geojson - Feature en formato GeoJSON
   * @param {Function} display - Función para mostrar el feature
   */
  toDisplayFeatures(state, geojson, display) {
    const isActivePolygon = geojson.properties.id === state.polygon.id;
    geojson.properties.active = isActivePolygon ? "true" : "false";
    
    // Solo mostrar si tiene coordenadas
    if (geojson.geometry.coordinates.length > 0) {
      display(geojson);
    }
  },

  /**
   * Deshabilita el trash (papelera) durante el dibujo
   * Se habilita automáticamente al terminar
   */
  onTrash(state) {
    this.deleteFeature([state.polygon.id], { silent: true });
    this.changeMode("simple_select");
  }
};

// Export nombrado y por defecto
export { DragCircleMode, CIRCLE_STEPS, DEFAULT_UNITS };
export default DragCircleMode;
