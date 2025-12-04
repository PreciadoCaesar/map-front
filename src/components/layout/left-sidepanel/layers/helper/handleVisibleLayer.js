export const handleVisibleLayer = (layerId, mapRef, setLayerViewControl) => {
  if (!mapRef) return;

  const map = mapRef.getMap();
  if (!map) return;

  // Obtener el layer actual
  const layer = map.getLayer(layerId);
  if (!layer) return;

  const currentVisibility = map.getLayoutProperty(layerId, 'visibility');
  const newVisibility = currentVisibility === 'visible' ? 'none' : 'visible';

  // Cambiar visibilidad del layer principal
  map.setLayoutProperty(layerId, 'visibility', newVisibility);

  // Cambiar visibilidad de outline si existe
  const outlineId = `outline-${layerId}`;
  if (map.getLayer(outlineId)) {
    map.setLayoutProperty(outlineId, 'visibility', newVisibility);
  }

  // Cambiar visibilidad de label si existe
  const labelId = `label-${layerId}`;
  if (map.getLayer(labelId)) {
    map.setLayoutProperty(labelId, 'visibility', newVisibility);
  }

  // Actualizar control de layers
  setLayerViewControl(prev => {
    const displayed = new Set(prev.displayed || []);
    const hidden = new Set(prev.hidden || []);

    if (newVisibility === 'visible') {
      displayed.add(layerId);
      displayed.add(outlineId);
      displayed.add(labelId);
      hidden.delete(layerId);
      hidden.delete(outlineId);
      hidden.delete(labelId);
    } else {
      hidden.add(layerId);
      hidden.add(outlineId);
      hidden.add(labelId);
      displayed.delete(layerId);
      displayed.delete(outlineId);
      displayed.delete(labelId);
    }

    return {
      displayed: Array.from(displayed),
      hidden: Array.from(hidden),
    };
  });
};
