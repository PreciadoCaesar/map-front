import { Popup } from "maplibre-gl";
import { areaHelper, distanceLine } from '../helper/DistanceHelper';
import { useLocalState } from "@/context/CleanLocalState";
import { useEffect, useRef, useCallback } from "react";

export const useMeasurementContent = () => {
  const { activeMapTool, polygonSelected } = useLocalState();
  const popupRef = useRef(null);
  const currentFeatureIdRef = useRef(null);

  // Función para limpiar popup existente
  const cleanupPopup = useCallback(() => {
    if (popupRef.current) {
      try {
        popupRef.current.remove();
      } catch (error) {
        console.error('Error removiendo popup:', error);
      } finally {
        popupRef.current = null;
        currentFeatureIdRef.current = null;
      }
    }
  }, []);

  // Función para actualizar o crear popup
  const updateMeasurementsUI = useCallback((text, map, coordinates) => {
    if (!map || !coordinates || coordinates.length !== 2) {
      console.warn('Coordenadas o mapa inválidos para mostrar medición');
      return;
    }

    try {
      // Limpiar popup anterior
      cleanupPopup();
      
      // Crear nuevo popup
      const popup = new Popup({
        closeButton: true,
        closeOnClick: false,
        className: 'measurement-popup',
        maxWidth: '300px'
      });
      
      popup
        .setLngLat(coordinates)
        .setHTML(`
          <div style="padding: 8px; font-size: 14px; font-weight: 500;">
            ${text}
          </div>
        `)
        .addTo(map);
      
      // Evento cuando se cierra el popup manualmente
      popup.on('close', () => {
        popupRef.current = null;
        currentFeatureIdRef.current = null;
      });
      
      popupRef.current = popup;
    } catch (error) {
      console.error('Error creando popup de medición:', error);
    }
  }, [cleanupPopup]);

  // Medir distancia de línea
  const updateMeasurementsDistance = useCallback(() => {
    if (!polygonSelected?.features?.[0] || !activeMapTool?.["Distancia"]) {
      return;
    }
    
    const feature = polygonSelected.features[0];
    const featureId = feature.id || feature.properties?.id;

    // Evitar actualizar si es la misma feature
    if (currentFeatureIdRef.current === featureId) {
      return;
    }

    if (feature.geometry.type === "LineString") {
      try {
        const result = distanceLine(feature);
        
        if (result.error) {
          console.error('Error calculando distancia:', result.error);
          return;
        }

        if (result.coordinates) {
          // Usar el formato ya procesado del helper
          updateMeasurementsUI(
            `📏 Longitud: ${result.formattedLength}`, 
            polygonSelected.map, 
            result.coordinates
          );
          currentFeatureIdRef.current = featureId;
        }
      } catch (error) {
        console.error('Error en medición de distancia:', error);
      }
    }
  }, [polygonSelected, activeMapTool, updateMeasurementsUI]);

  // Medir área de polígono
  const updateMeasurementsArea = useCallback(() => {
    if (!polygonSelected?.features?.[0] || !activeMapTool?.["Área y perímetro"]) {
      return;
    }
    
    const feature = polygonSelected.features[0];
    const featureId = feature.id || feature.properties?.id;

    // Evitar actualizar si es la misma feature
    if (currentFeatureIdRef.current === featureId) {
      return;
    }

    if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
      try {
        const result = areaHelper(feature);
        
        if (result.error) {
          console.error('Error calculando área:', result.error);
          return;
        }

        if (result.coordinates) {
          // Usar los formatos ya procesados del helper
          updateMeasurementsUI(
            `
              📐 Área: ${result.formattedArea}<br>
              📏 Perímetro: ${result.formattedPerimeter}
            `, 
            polygonSelected.map, 
            result.coordinates
          );
          currentFeatureIdRef.current = featureId;
        }
      } catch (error) {
        console.error('Error en medición de área:', error);
      }
    }
  }, [polygonSelected, activeMapTool, updateMeasurementsUI]);

  // Effect para manejar las mediciones
  useEffect(() => {
    // Si ninguna herramienta está activa, limpiar popup
    if (!activeMapTool?.["Área y perímetro"] && !activeMapTool?.["Distancia"]) {
      cleanupPopup();
      return;
    }

    // Actualizar mediciones según la herramienta activa
    if (activeMapTool["Área y perímetro"]) {
      updateMeasurementsArea();
    } else if (activeMapTool["Distancia"]) {
      updateMeasurementsDistance();
    }

    // Cleanup cuando el componente se desmonta o cambia la feature
    return () => {
      cleanupPopup();
    };
  }, [
    polygonSelected?.features?.[0]?.id, 
    activeMapTool, 
    cleanupPopup
    // NO incluir updateMeasurementsArea/Distance para evitar ciclos infinitos
  ]);

  // Cleanup adicional cuando cambian las herramientas
  useEffect(() => {
    return () => {
      cleanupPopup();
    };
  }, [activeMapTool?.["Distancia"], activeMapTool?.["Área y perímetro"], cleanupPopup]);

  return null;
};
