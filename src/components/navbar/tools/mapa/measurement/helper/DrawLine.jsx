import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useLocalState } from '@/context/CleanLocalState';

export default function DrawLine() {
  const mapRef = useSelector((state) => state.mapReducer.mapRef);
  const mapBoxDrawStateRef = useSelector((state) => state.mapReducer.mapBoxDrawStateRef);
  const { activeMapTool, setActiveMapTool } = useLocalState();
  
  // Usar ref para evitar bucle infinito
  const isActivatingRef = useRef(false);

  useEffect(() => {
    // Verificar que existan las referencias necesarias
    if (!mapBoxDrawStateRef || !mapRef) {
      return;
    }

    const isDistanceActive = activeMapTool?.['Distancia'];
    const mapCanvas = mapRef.getCanvas();

    // Si está activo y no estamos en proceso de activación
    if (isDistanceActive && !isActivatingRef.current) {
      isActivatingRef.current = true;
      
      // Cambiar al modo de dibujo de línea
      mapBoxDrawStateRef.changeMode('draw_line_string');
      
      // Cambiar cursor
      mapCanvas.classList.remove('cursor-pointer-icon');
      mapCanvas.classList.add('cursor-crosshair');
      
      console.log('Modo de medición de distancia activado');
    } 
    // Si está inactivo y estábamos activos antes
    else if (!isDistanceActive && isActivatingRef.current) {
      isActivatingRef.current = false;
      
      // Volver al modo de selección simple
      mapBoxDrawStateRef.changeMode('simple_select');
      
      // Restaurar cursor
      mapCanvas.classList.remove('cursor-crosshair');
      mapCanvas.classList.add('cursor-pointer-icon');
      
      console.log('Modo de medición de distancia desactivado');
    }

    // Cleanup cuando el componente se desmonta
    return () => {
      if (isActivatingRef.current && mapBoxDrawStateRef && mapRef) {
        try {
          const canvas = mapRef.getCanvas();
          mapBoxDrawStateRef.changeMode('simple_select');
          canvas.classList.remove('cursor-crosshair');
          canvas.classList.add('cursor-pointer-icon');
        } catch (error) {
          console.error('Error en cleanup de DrawLine:', error);
        }
      }
    };
  }, [activeMapTool, mapBoxDrawStateRef, mapRef]); // Dependencias completas

  // Los componentes custom hooks no retornan JSX
  return null;
}
