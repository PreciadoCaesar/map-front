import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import layersData from '../../capas_url/capas_url.json';
import { Source, Layer } from 'react-map-gl';
import DrawControl from '@/components/toolbox/Toolbar';
import { fetchFeatures } from '@/redux/features/FeaturesSlice';

export const CustomLayers = () => {
  const dispatch = useDispatch();
  const drawRef = useSelector(state => state?.mapReducer?.mapBoxDrawStateRef ?? null);
  const features = useSelector(state => state?.featuresReducer?.features ?? []);
  const drawControlRef = useRef();
  
  // Estado para almacenar los datos GeoJSON de cada capa
  const [layerDataCache, setLayerDataCache] = useState({});

  // Cargar features del backend al montar
  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);

  // Cargar datos GeoJSON de las capas
  useEffect(() => {
    layersData.forEach(async (layer) => {
      if (layer['source-type'] === 'geojson' && layer['source-url']) {
        try {
          const response = await fetch(layer['source-url']);
          const data = await response.json();
          setLayerDataCache(prev => ({
            ...prev,
            [layer.id]: data
          }));
        } catch (error) {
          console.error(`Error cargando capa ${layer.id}:`, error);
        }
      }
    });
  }, []);

  // Agregar features del backend al DrawControl
  useEffect(() => {
    if (drawRef && features.length > 0) {
      const existingFeatures = drawRef.getAll();
      if (existingFeatures?.features && Array.isArray(existingFeatures.features)) {
        existingFeatures.features.forEach(f => {
          try {
            drawRef.delete(f.id);
          } catch (e) {
            // Ignorar si no existe
          }
        });
      }

      features.forEach(feature => {
        try {
          const safeName = feature?.name || feature?.properties?.name || feature?.layer || "Sin nombre";
          const safeLayer = feature?.layer || feature?.properties?.layer || "sin_capa";
          drawRef.add({
            id: String(feature?.properties?.feature_id || feature?.id),
            type: feature?.type,
            geometry: feature?.geometry,
            properties: {
              ...feature?.properties,
              name: safeName,
              layer: safeLayer,
            }
          });
        } catch (error) {
          console.error('Error agregando feature:', error);
        }
      });
    }
  }, [drawRef, features]);

  return (
    <>
      {Array.isArray(layersData) && layersData.map(layer => {
        // Para capas GeoJSON
        if (layer['source-type'] === 'geojson') {
          const data = layerDataCache[layer.id];
          if (!data) return null;

          return (
            <Source
              key={layer.id}
              id={layer.id}
              type="geojson"
              data={data}
            >
              {/* Fill layer */}
              <Layer
                id={layer.id}
                {...layer.style}
              />
              
              {/* Outline layer */}
              {layer.outline && (
                <Layer
                  id={layer.outline.id}
                  {...layer.outline}
                />
              )}
              
              {/* Label layer */}
              {layer.label && (
                <Layer
                  id={layer.label.id}
                  {...layer.label}
                />
              )}
            </Source>
          );
        }

        // Para capas Vector Tiles (las que tenías antes con PBF)
        return (
          <Source
            key={layer.id}
            id={layer.id}
            type="vector"
            tiles={[layer["source-layer"]]}
            scheme="tms"
            name={layer.capa_name}
          >
            <Layer
              id={layer.id}
              source={layer.capa_name}
              source-layer={layer.capa_name}
              {...layer.style}
            />
            {layer.outline && (
              <Layer
                id={layer.outline.id}
                source-layer={layer.id}
                {...layer.outline}
              />
            )}
          </Source>
        );
      })}

      <DrawControl ref={drawControlRef} position="top-right" />
    </>
  );
};
