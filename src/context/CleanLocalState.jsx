import { createContext, useContext, useState, useMemo } from "react";
import PropTypes from 'prop-types';
import { mapStyles } from '@/components/navbar/tools/mapa/capa/basemap-style/constants/styles.js';

/**
 * Contexto para el estado local de la aplicación
 * Maneja estado que no necesita persistencia en Redux
 */
const LocalStateContext = createContext(null);

/**
 * Valores iniciales del estado
 */
const INITIAL_STATE = {
  mapType: mapStyles[0] || null,
  layerViewControl: {
    displayed: [],
    hidden: []
  },
  layerActiveGeoserver: null,
  columnLayerActive: [],
  openPanel: {
    left: false,
    right: false,
    bottom: false
  },
  currentPage: 1,
  activeMapTool: {},
  map: null, // ⬅️ Instancia del mapa de MapLibre
};

/**
 * Provider del contexto de estado local
 */
export const LocalStateProvider = ({ children }) => {
  // Estados de mapa
  const [mapType, setMapType] = useState(INITIAL_STATE.mapType);
  const [layerViewControl, setLayerViewControl] = useState(INITIAL_STATE.layerViewControl);
  const [map, setMap] = useState(INITIAL_STATE.map);

  // Estados de capas
  const [layerActiveGeoserver, setLayerActiveGeoserver] = useState(INITIAL_STATE.layerActiveGeoserver);
  const [columnLayerActive, setColumnLayerActive] = useState(INITIAL_STATE.columnLayerActive);

  // Estados de paneles
  const [openPanel, setOpenPanel] = useState(INITIAL_STATE.openPanel);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(INITIAL_STATE.currentPage);

  // Estados de herramientas del mapa
  const [activeMapTool, setActiveMapTool] = useState(INITIAL_STATE.activeMapTool);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo(() => ({
    // Mapa base
    mapType,
    setMapType,
    layerViewControl,
    setLayerViewControl,
    map,
    setMap,

 
    layerActiveGeoserver,
    setLayerActiveGeoserver,
    columnLayerActive,
    setColumnLayerActive,

 
    openPanel,
    setOpenPanel,

    // Herramientas del mapa
    activeMapTool,
    setActiveMapTool,

    // Paginación
    currentPage,
    setCurrentPage,
    itemsPerPage: 20,
  }), [
    mapType,
    layerViewControl,
    map,
    layerActiveGeoserver,
    columnLayerActive,
    openPanel,
    activeMapTool,
    currentPage,
  ]);

  return (
    <LocalStateContext.Provider value={contextValue}>
      {children}
    </LocalStateContext.Provider>
  );
};

LocalStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

 
export const useLocalState = () => useContext(LocalStateContext);
