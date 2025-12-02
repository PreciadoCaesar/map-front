import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useMemo } from 'react';
import { icons } from "./iconsEdicion";
import { setActiveLayer } from '@/redux/features/mapSlice';

export const EdicionToolBar = () => {
  const dispatch = useDispatch();
  const drawRef = useSelector(state => state?.mapReducer?.mapBoxDrawStateRef ?? null);
  const activeLayer = useSelector(state => state?.mapReducer?.activeLayer ?? null);

  const handleIconClick = useCallback((icon) => {
    if (drawRef && icon.mode) {
      dispatch(setActiveLayer(icon.layer));
      drawRef.changeMode(icon.mode);
      console.log(`Activado modo: ${icon.mode} para layer: ${icon.layer}`);
    } else {
      console.log("El DrawControl aún no está listo o el ícono no tiene modo asignado");
    }
  }, [drawRef, dispatch]);

  // Agrupar iconos por sección
  const iconsBySection = useMemo(() => {
    return {
      editar: icons.filter(icon => icon.section === "editar"),
      infraestructura: icons.filter(icon => icon.section === "infraestructura"),
      red: icons.filter(icon => icon.section === "red"),
      validar: icons.filter(icon => icon.section === "validar")
    };
  }, []);

  const renderIcon = (icon, index, layoutClass = "flex flex-col") => {
    const isActive = activeLayer === icon.layer;
    
    return (
      <button
        key={`${icon.section}-${icon.label}-${index}`}
        onClick={() => handleIconClick(icon)}
        className={`
          ${layoutClass} 
          items-center 
          ${icon.cols || 'w-[80px]'}
          ${isActive ? 'text-[#49b0f2] bg-blue-50' : 'text-gray-700'} 
          hover:text-[#49b0f2] 
          cursor-pointer 
          h-full 
          text-center 
          gap-1
          px-2 
          py-1 
          rounded 
          transition-colors
          border-2
          ${isActive ? 'border-[#49b0f2]' : 'border-transparent'}
        `}
        type="button"
        aria-label={icon.label}
        aria-pressed={isActive}
      >
        {icon.svg}
        <span className="mt-1">{icon.label}</span>
      </button>
    );
  };

  return (
    <div className="flex items-center bg-white px-2 shadow-sm w-auto overflow-x-auto custom-scrollbar text-[10px]">
      {/* Sección Editar */}
      <div className="border-r border-gray-300 pr-2 flex flex-col h-full justify-between">
        <div className="flex items-center gap-2">
          {iconsBySection.editar.map((icon, index) => renderIcon(icon, index))}
        </div>
        <span className="text-[12px] text-center text-gray-700">Editar</span>
      </div>

      {/* Sección Infraestructura */}
      <div className="border-r border-gray-300 pr-2 flex flex-col w-full h-full justify-between">
        <div className="grid auto-rows-min gap-2 grid-cols-[repeat(auto-fit,minmax(50px,1fr))]">
          {iconsBySection.infraestructura.map((icon, index) => 
            renderIcon(icon, index, "flex gap-1")
          )}
        </div>
        <span className="text-[12px] text-center text-gray-700">Infraestructura</span>
      </div>

      {/* Sección Red */}
      <div className="border-r border-gray-300 pr-2 flex flex-col h-full justify-between">
        <div className="flex items-center gap-2">
          {iconsBySection.red.map((icon, index) => renderIcon(icon, index))}
        </div>
        <span className="text-[12px] text-center text-gray-700">Red</span>
      </div>

      {/* Sección Validar */}
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center gap-2">
          {iconsBySection.validar.map((icon, index) => renderIcon(icon, index))}
        </div>
      </div>
    </div>
  );
};
