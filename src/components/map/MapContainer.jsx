import { useEffect, useRef, useState } from 'react'
import Map from 'react-map-gl/maplibre';
import mapLibregl from 'maplibre-gl';
import { NavbarContainer } from '@/components/navbar/NavbarContainer.jsx';
import { LeftPanel } from '../layout/left-sidepanel/LeftPanel';
import { RightPanel } from '../layout/rigth-sidepanel/RightPanel';
import { BottomPanel } from '../layout/bottom-sidepanel/BottomPanel';
import { useLocalState } from '../../context/CleanLocalState';
import { CustomLayers } from './CustomLayers';
import { GeographicMapLayers } from './GeographicMapLayers';  // ← NUEVO
import { useDispatch, useSelector } from 'react-redux';
import { setMapref } from '../../redux/features/mapSlice';
import { fetchFeatures } from '../../redux/features/FeaturesSlice';

export const MapContainer = () => {
  const dispatch = useDispatch()
  const features = useSelector(state => state?.featuresReducer?.features ?? []);
  const drawRef = useSelector(state => state?.mapReducer?.mapBoxDrawStateRef ?? null);
  const loadedFeaturesRef = useRef(new Set());
  const [mapReady, setMapReady] = useState(false);

  const INITIAL_POSITION = {
    latitude: -12.020545729298373,
    longitude: -77.0269319335112,
  }
  const ZOOM = 9;
  const mapRef = useRef(null);

  const { mapType, layerViewControl } = useLocalState()

  const onLoad = () => {
    dispatch(setMapref(mapRef.current))
  }

  const onStyleLoad = async () => {
    setMapReady(true);
    try {
      await dispatch(fetchFeatures()).unwrap();
    } catch (error) {
      console.error('Error cargando features del backend:', error);
    }
  }

  // Cargar features en el mapa cuando estén disponibles
  useEffect(() => {
    if (drawRef && features.length > 0 && mapReady) {
      features.forEach(feature => {
        const featureId = feature.properties.feature_id;
        if (!loadedFeaturesRef.current.has(featureId)) {
          drawRef.add(feature);
          loadedFeaturesRef.current.add(featureId);
        }
      });
    }
  }, [features, drawRef, mapReady]);

  const onStyleData = (e) => {
    const { displayed, hidden } = layerViewControl;
    displayed.forEach(layerId => {
      if (e.target.getLayer(layerId)) {
        e.target.setLayoutProperty(layerId, 'visibility', 'visible');
      }
    });
    hidden.forEach(layerId => {
      if (e.target.getLayer(layerId)) {
        e.target.setLayoutProperty(layerId, 'visibility', 'none');
      }
    });
  }

  return (
    <>
      <NavbarContainer />
      <LeftPanel />
      <BottomPanel />
      <RightPanel />
      <Map
        ref={mapRef}
        onLoad={onLoad}
        onStyleLoad={onStyleLoad}
        onStyleData={onStyleData}
        attributionControl={false}
        initialViewState={{ longitude: INITIAL_POSITION.longitude, latitude: INITIAL_POSITION.latitude, zoom: ZOOM }}
        mapLib={mapLibregl}
        interactive={true}
        mapStyle={mapType.source}
        style={{ width: '100dvw', height: '100dvh' }}
      >
        <CustomLayers />
        <GeographicMapLayers />  {/* ← NUEVO */}
      </Map>
    </>
  )
}
