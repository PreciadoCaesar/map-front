import { forwardRef, useEffect, useImperativeHandle } from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { SRMode, SRStyle } from './MapboxScaleRotateMode';
import DragCircleCustomMode from "./drawCircle/drawCircle";
import { setMapboxDrawRef } from '@/redux/features/mapSlice';
import { createFeature, updateFeature, deleteFeature } from '@/redux/features/FeaturesSlice';

const DrawControl = forwardRef(({ position }, ref) => {
  const dispatch = useDispatch();
  const activeLayer = useSelector(state => state?.mapReducer?.activeLayer ?? null);

  // Handler de creación seguro, con valores por defecto y sintaxis correcta
  const handleCreate = (e) => {
    e.features.forEach((feature) => {
      const safeName = feature.properties?.name || activeLayer || "Feature";
      const safeLayer = activeLayer || feature.properties?.layer || "sin_capa";
      const payload = {
        type: "Feature",
        geometry: feature.geometry,
        name: safeName,
        layer: safeLayer,
        properties: {
          ...feature.properties,
          name: safeName,
          layer: safeLayer,
        },
        project_id: 1, // Confírmalo con el proyecto activo realmente
      };

      console.log("Creando feature con layer:", activeLayer, payload);
      dispatch(createFeature(payload));
    });
  };

  // Handler de actualización seguro
  const handleUpdate = (e) => {
    e.features.forEach((feature) => {
      const featureId = feature.properties?.feature_id || feature.id;
      const safeLayer = feature.properties?.layer || activeLayer || "sin_capa";
      const payload = {
        geometry: feature.geometry,
        properties: {
          ...feature.properties,
          layer: safeLayer,
        },
        project_id: 1,
      };

      console.log("Actualizando feature:", featureId, payload);
      dispatch(updateFeature({ id: featureId, feature: payload }));
    });
  };

  // Handler de eliminación seguro
  const handleDelete = (e) => {
    e.features.forEach((feature) => {
      const featureId = feature.properties?.feature_id || feature.id;
      console.log("Eliminando feature:", featureId);
      dispatch(deleteFeature(featureId));
    });
  };

  const modes = { 
    ...MapboxDraw.modes, 
    draw_circle: DragCircleCustomMode, 
    scaleRotateMode: SRMode 
  };

  const draw = useControl(
    () => new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: false,
        line_string: false,
        polygon: false,
        trash: true
      },
      userProperties: true,
      styles: SRStyle,
      modes
    }),
    ({ map }) => {
      map.on('draw.create', handleCreate);
      map.on('draw.update', handleUpdate);
      map.on('draw.delete', handleDelete);
    },
    ({ map }) => {
      map.off('draw.create', handleCreate);
      map.off('draw.update', handleUpdate);
      map.off('draw.delete', handleDelete);
    },
    { position }
  );

  useEffect(() => {
    dispatch(setMapboxDrawRef(draw));
    return () => { dispatch(setMapboxDrawRef(null)); };
  }, [draw, dispatch]);

  useImperativeHandle(ref, () => ({
    add: draw.add.bind(draw),
    delete: draw.delete.bind(draw),
    getAll: draw.getAll.bind(draw),
    changeMode: draw.changeMode.bind(draw)
  }));

  return null;
});

DrawControl.displayName = "DrawControl";

export default DrawControl;
