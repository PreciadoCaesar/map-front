export const handleVisibleLayer = (id,mapRef,setLayerViewControl)=>{
    const newState = { displayed: [], hidden: [] };
    const visibility = mapRef?.getMap().getLayoutProperty(id, 'visibility');
    // if (l.id.includes('symbol')) return;
    if (visibility === 'visible') {
        if(mapRef?.getMap().getLayer(id)){
            mapRef?.getMap().setLayoutProperty(id, 'visibility', 'none');
            newState.hidden.push(id);
        }
        if(mapRef?.getMap().getLayer(`outline-${id}`)){
            mapRef?.getMap().setLayoutProperty(`outline-${id}`, 'visibility', 'none');
            newState.hidden.push(`outline-${id}`);
        }

    } else {
        if(mapRef?.getMap().getLayer(id)){
            mapRef?.getMap().setLayoutProperty(id, 'visibility', 'visible');
            newState.displayed.push(id);
        }
        if(mapRef?.getMap().getLayer(`outline-${id}`)){
           mapRef?.getMap().setLayoutProperty(`outline-${id}`, 'visibility', 'visible');
           newState.displayed.push(`outline-${id}`);
        }
        
    }
    setLayerViewControl(prev => {
      const prevDisplayed = new Set(prev.displayed);
      const prevHidden = new Set(prev.hidden);
      
      // Filtrar capas que ya existen en el estado anterior
      const finalDisplayed = [
          ...prev.displayed.filter(id => !newState.hidden.includes(id)),
          ...newState.displayed.filter(id => !prevHidden.has(id))
      ];
      
      const finalHidden = [
          ...prev.hidden.filter(id => !newState.displayed.includes(id)),
          ...newState.hidden.filter(id => !prevDisplayed.has(id))
      ];

      return {
          displayed: [...new Set(finalDisplayed)],
          hidden: [...new Set(finalHidden)]
      };
  });
  }