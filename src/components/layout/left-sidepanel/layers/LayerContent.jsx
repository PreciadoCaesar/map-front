import { useState, useMemo, useRef, useEffect } from "react";
import layerData from "@/capas_url/capas_url.json";
import { useSelector } from "react-redux";
import { handleVisibleLayer } from "./helper/handleVisibleLayer";
import { useLocalState } from "../../../../context/CleanLocalState";

export const LayerContent = () => {
  const [visibleLayers, setVisibleLayers] = useState({});
  const [expandedCats, setExpandedCats] = useState({});
  const mapRef = useSelector((state) => state?.mapReducer?.mapRef ?? null);

  const { setLayerViewControl, setLayerActiveGeoserver, layerActiveGeoserver } =
    useLocalState();

  // 🔥 CORRECTO: refs por categoría (NO dentro de loops)
  const categoryRefs = useRef({});

  // 📌 Agrupar capas
  const grouped = useMemo(() => {
    return layerData.reduce((acc, layer) => {
      acc[layer.category] = acc[layer.category] || [];
      acc[layer.category].push(layer);
      return acc;
    }, {});
  }, []);

  // 🔥 Actualizar indeterminate al cambiar estados
  useEffect(() => {
    Object.entries(grouped).forEach(([category, layers]) => {
      const allActive = layers.every((l) => visibleLayers[l.id]);
      const someActive = layers.some((l) => visibleLayers[l.id]);
      const ref = categoryRefs.current[category];

      if (ref) {
        ref.indeterminate = someActive && !allActive;
      }
    });
  }, [visibleLayers, grouped]);

  // ========================
  // HANDLERS
  // ========================

  const toggleLayer = (id) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    if (!mapRef) return;
    handleVisibleLayer(id, mapRef, setLayerViewControl);
  };

  const toggleCategoryLayers = (category, layers) => {
    if (!mapRef) return;

    const allActive = layers.every((l) => visibleLayers[l.id]);
    const next = { ...visibleLayers };

    layers.forEach((l) => {
      next[l.id] = !allActive;
      handleVisibleLayer(l.id, mapRef, setLayerViewControl);
    });

    setVisibleLayers(next);
  };

  const toggleExpand = (category) => {
    setExpandedCats((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSelectLayer = (layer) => {
    if (!mapRef) return;

    const visibility = mapRef
      ?.getMap()
      ?.getLayoutProperty(layer.id, "visibility");

    if (visibility !== "visible") return;

    if (layer.id === layerActiveGeoserver?.id) {
      setLayerActiveGeoserver(null);
    } else {
      setLayerActiveGeoserver(layer);
    }
  };

  // ========================
  // RENDER
  // ========================

  return (
    <div className="p-2">
      {Object.entries(grouped).map(([category, layers]) => {
        const allActive = layers.every((l) => visibleLayers[l.id]);
        const isExpanded = expandedCats[category] ?? true;

        // Registrar ref para cada categoría
        if (!categoryRefs.current[category]) {
          categoryRefs.current[category] = document.createElement("input");
        }

        return (
          <div key={category} className="mb-2">
            <div className="flex items-center gap-2">
              <span
                onClick={() => toggleExpand(category)}
                className="text-lg cursor-pointer select-none transform transition-transform"
              >
                {isExpanded ? "◂" : "▸"}
              </span>

              <input
                ref={(el) => (categoryRefs.current[category] = el)}
                type="checkbox"
                id={`cat-${category}`}
                checked={allActive}
                onChange={() => toggleCategoryLayers(category, layers)}
                className="h-4 w-4 accent-[#49b0f2]"
              />

              <label
                onClick={() => toggleExpand(category)}
                className="font-medium cursor-pointer select-none"
              >
                {category}
              </label>
            </div>

            {/* === LISTA DE CAPAS === */}
            {isExpanded && (
              <ul className="pl-6 mt-1 space-y-1">
                {layers.map((layer) => (
                  <li
                    key={layer.id}
                    className={`flex items-center space-x-2 hover:bg-sky-200 p-1 pl-2.5 ${
                      layerActiveGeoserver?.id === layer.id && "bg-sky-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={layer.id}
                      checked={!!visibleLayers[layer.id]}
                      onChange={() => toggleLayer(layer.id)}
                      className="h-4 w-4 accent-[#49b0f2]"
                    />

                    <label
                      className="text-sm cursor-pointer select-none"
                      onClick={() => handleSelectLayer(layer)}
                    >
                      {layer.id}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};
