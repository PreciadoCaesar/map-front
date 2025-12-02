import { useEffect, useRef, useState } from "react";
import { useLocalState } from "../../../../context/CleanLocalState";
import { useSelector } from "react-redux";
import { RenderTableDown } from "./RenderTableDown";
import Pagination from "./Pagination";

export const TableContent = () => {
    const { 
        openPanel, setOpenPanel, layerActiveGeoserver, 
        setLayerActiveGeoserver, columnLayerActive, setColumnLayerActive,
        currentPage, itemsPerPage, setCurrentPage
    } = useLocalState()
    
    // CORREGIDO: Acceso seguro al estado con validación completa
    const mapRef = useSelector(state => state?.mapReducer?.mapRef ?? null)
    
    const [dataTable, setDataTable] = useState(null)
    const currentLayerRef = useRef(null)

  useEffect(() => {
      if (!layerActiveGeoserver) {
        setDataTable(null)
        currentLayerRef.current = null
        return
      }
      
      // Validar que mapRef existe antes de usarlo
      if (!mapRef) {
        console.log("Esperando que el mapa se cargue...");
        return;
      }
      
      const map = mapRef.getMap()
      
      const getFeaturesOnZoom = () => {
        /* 
            Obtiene las features de la capa seleccionada 
            y la almacena en dataTable
        */
        const dataLayer = []
        const features = map.queryRenderedFeatures()      
          
        features?.map(layer => {
          if (layer.layer.id === layerActiveGeoserver.id || layer.layer.id === layerActiveGeoserver.outline?.id) {
            dataLayer.push(layer)
          }
        })
        setDataTable(dataLayer)    
        setColumnLayerActive(dataLayer[0]?._vectorTileFeature?._keys)
        currentLayerRef.current = layerActiveGeoserver
      }
      
      if (!layerActiveGeoserver) {
          map.off("moveend", getFeaturesOnZoom)
        return
      }
      
      if (currentLayerRef.current != layerActiveGeoserver) {
        getFeaturesOnZoom()
      }
     
      map.on("moveend", getFeaturesOnZoom)
      
      return () => map.off("moveend", getFeaturesOnZoom)

    }, [layerActiveGeoserver, mapRef])

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Header */}
      <div
        className={`pr-1 flex justify-between bg-gray-100 ${
          layerActiveGeoserver &&
          layerActiveGeoserver.capa_name &&
          "border-b-2 border-[#0079c1]"
        }`}
      >
        <div
          className={`${
            !layerActiveGeoserver
              ? "bg-transparent text-gray-100"
              : "text-white"
          } flex items-center gap-2 px-1 bg-[#0079c1] `}
        >
          <h1 className="text-[12px]">{layerActiveGeoserver?.capa_name}</h1>
          <button onClick={() => setLayerActiveGeoserver(null)} className="text-[12px] font-medium cursor-pointer">
            X
          </button>
        </div>
        <button onClick={() => setOpenPanel((prev) => ({ ...prev, bottom: !openPanel.bottom }))}
          className="text-gray-400 text-[14px] font-sans cursor-pointer px-1 rounded-sm hover:bg-red-300 hover:text-black"
        >
          X
        </button>
      </div>
      {/* content */}
      <RenderTableDown dataTable={dataTable} columnHeaders={columnLayerActive} />
      {/* Footer */}
      <div className="relative place-self-end mr-5 py-1">
        <Pagination currentPage={currentPage} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} data={dataTable} />
      </div>
    </div>
  );
};
