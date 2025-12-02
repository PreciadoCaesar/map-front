import { useEffect, useRef } from 'react';
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

  // Cargar features del backend al montar
  useEffect(() => {
    dispatch(fetchFeatures());
  }, [dispatch]);

  // Agregar features al DrawControl cuando estén listas
  useEffect(() => {
    if (drawRef && features.length > 0) {
      // Limpiar features anteriores
      const existingFeatures = drawRef.getAll();
      if (existingFeatures?.features && Array.isArray(existingFeatures.features)) {
        existingFeatures.features.forEach(f => {
          try {
            drawRef.delete(f.id);
          } catch (e) {
            // Puede que no exista, ignora
          }
        });
      }

      // Agregar features del backend
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
      {Array.isArray(layersData) && layersData.map(layer => (
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
      ))}

      {/* DrawControl para manejar geometrías */}
      <DrawControl ref={drawControlRef} position="top-right" />
    </>
  );
};

