import { forwardRef, useEffect, useImperativeHandle, useState, useRef } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { SRMode, SRStyle } from './MapboxScaleRotateMode';
import DragCircleCustomMode from './drawCircle/drawCircle';
import { setMapboxDrawRef } from '@/redux/features/mapSlice';
import { createFeature, updateFeature, deleteFeature } from '@/redux/features/FeaturesSlice';
import * as turf from '@turf/turf';

const DrawControl = forwardRef(({ position }, ref) => {
  const dispatch = useDispatch();
  const activeLayer = useSelector(state => state?.mapReducer?.activeLayer ?? null);
  const measureMode = useSelector(state => state?.mapReducer?.measureMode ?? null);

  const [measureInfo, setMeasureInfo] = useState(null);
  const isMeasureMode = measureMode === 'distance' || measureMode === 'area';

  const isMeasureModeRef = useRef(isMeasureMode);
  
  useEffect(() => {
    isMeasureModeRef.current = isMeasureMode;
  }, [isMeasureMode]);

  const computeMeasure = (feature) => {
    if (!feature || !feature.geometry) return;

    const { type, coordinates } = feature.geometry;

    if (type === 'LineString') {
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        setMeasureInfo(null);
        return;
      }
      try {
        const lengthKm = turf.length(feature, { units: 'kilometers' });
        setMeasureInfo({
          type: 'line',
          text: `Distancia: ${lengthKm.toFixed(2)} km`,
        });
      } catch (e) {
        console.error('Error midiendo línea:', e);
      }
    }

    if (type === 'Polygon') {
      if (
        !Array.isArray(coordinates) ||
        coordinates.length === 0 ||
        !Array.isArray(coordinates[0]) ||
        coordinates[0].length < 3
      ) {
        setMeasureInfo(null);
        return;
      }
      try {
        const areaM2 = turf.area(feature);
        const areaKm2 = areaM2 / 1_000_000;
        const line = turf.polygonToLine(feature);
        const perimeterKm = turf.length(line, { units: 'kilometers' });
        setMeasureInfo({
          type: 'polygon',
          text: `Área: ${areaKm2.toFixed(2)} km²  -  Perímetro: ${perimeterKm.toFixed(2)} km`,
        });
      } catch (e) {
        console.error('Error midiendo polígono:', e);
      }
    }
  };

  const updateMeasureFromDraw = () => {
    if (!isMeasureModeRef.current) {
      setMeasureInfo(null);
      return;
    }
    const collection = draw.getAll();
    const features = collection?.features || [];
    if (!features.length) {
      setMeasureInfo(null);
      return;
    }
    const feature = features[features.length - 1];
    computeMeasure(feature);
  };

  const handleCreate = (e) => {
    e.features.forEach((feature) => {
      if (isMeasureModeRef.current) {
        return;
      }

      const safeName = feature.properties?.name || activeLayer || 'Feature';
      const safeLayer = activeLayer || feature.properties?.layer || 'sin_capa';
      const payload = {
        type: 'Feature',
        geometry: feature.geometry,
        name: safeName,
        layer: safeLayer,
        properties: {
          ...feature.properties,
          name: safeName,
          layer: safeLayer,
        },
        project_id: 1,
      };

      dispatch(createFeature(payload));
    });

    updateMeasureFromDraw();
  };

  const handleUpdate = (e) => {
    e.features.forEach((feature) => {
      if (isMeasureModeRef.current) {
        return;
      }

      const featureId = feature.properties?.feature_id || feature.id;
      const safeLayer = feature.properties?.layer || activeLayer || 'sin_capa';
      const payload = {
        geometry: feature.geometry,
        properties: {
          ...feature.properties,
          layer: safeLayer,
        },
        project_id: 1,
      };

      dispatch(updateFeature({ id: featureId, feature: payload }));
    });

    updateMeasureFromDraw();
  };

  const handleDelete = (e) => {
    e.features.forEach((feature) => {
      if (!isMeasureModeRef.current) {
        const featureId = feature.properties?.feature_id || feature.id;
        dispatch(deleteFeature(featureId));
      }
    });
    setMeasureInfo(null);
  };

  const modes = {
    ...MapboxDraw.modes,
    draw_circle: DragCircleCustomMode,
    scaleRotateMode: SRMode,
  };

  const draw = useControl(
    () =>
      new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: false,
          line_string: false,
          polygon: false,
          trash: true,
        },
        userProperties: true,
        styles: SRStyle,
        modes,
      }),
    ({ map }) => {
      map.on('draw.create', handleCreate);
      map.on('draw.update', handleUpdate);
      map.on('draw.delete', handleDelete);
      map.on('draw.render', updateMeasureFromDraw);
      map.on('draw.selectionchange', updateMeasureFromDraw);
    },
    ({ map }) => {
      map.off('draw.create', handleCreate);
      map.off('draw.update', handleUpdate);
      map.off('draw.delete', handleDelete);
      map.off('draw.render', updateMeasureFromDraw);
      map.off('draw.selectionchange', updateMeasureFromDraw);
    },
    { position },
  );

  useEffect(() => {
    if (!draw) return;

    // Detectar modo "delete" para eliminar de BD
    if (measureMode === 'delete') {
      const all = draw.getAll();
      if (all && all.features) {
        all.features.forEach((f) => {
          const featureId = f.properties?.feature_id || f.id;
          if (featureId) {
            dispatch(deleteFeature(featureId));
          }
        });
      }
      setMeasureInfo(null);
      return;
    }

    const all = draw.getAll();
    if (all && all.features && isMeasureMode) {
      all.features.forEach((f) => draw.delete(f.id));
    }

    setMeasureInfo(null);

    if (measureMode === 'distance') {
      draw.changeMode('draw_line_string');
    } else if (measureMode === 'area') {
      draw.changeMode('draw_polygon');
    } else {
      setMeasureInfo(null);
    }
  }, [measureMode, isMeasureMode, draw, dispatch]);

  useEffect(() => {
    dispatch(setMapboxDrawRef(draw));
    return () => {
      dispatch(setMapboxDrawRef(null));
    };
  }, [draw, dispatch]);

  useImperativeHandle(ref, () => ({
    add: draw.add.bind(draw),
    delete: draw.delete.bind(draw),
    getAll: draw.getAll.bind(draw),
    changeMode: draw.changeMode.bind(draw),
  }));

  if (!isMeasureMode || !measureInfo) return null;

  return (
    <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-1 rounded shadow text-xs z-[1100]">
      {measureInfo.text}
    </div>
  );
});

DrawControl.displayName = 'DrawControl';

export default DrawControl;
