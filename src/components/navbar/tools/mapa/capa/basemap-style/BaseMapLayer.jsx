import { mapStyles } from './constants/styles'
import { useLocalState } from '@/context/CleanLocalState'

export const BaseMapLayer = () => {
  const { activeMapTool, setMapType, mapType } = useLocalState()
  
  const handleMapTypeChange = (style) => {
    setMapType(style)
  };

  // No renderizar si el panel no está activo
  if (!activeMapTool || !activeMapTool['Mapa base ▼']) {
    return null;
  }

  return (
    <div className="absolute z-[1000] top-[165px] left-1/2 -translate-x-1/2 md:left-[20%] md:translate-x-0 w-[70px] md:w-[350px] h-auto bg-white shadow-lg border border-gray-400/70 rounded">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 p-2">
        {mapStyles && mapStyles.length > 0 ? (
          mapStyles.map((style) => {
            const isActive = mapType?.id === style.id;
            
            return (
              <button
                key={style.id}
                onClick={() => handleMapTypeChange(style)}
                className={`
                  col-span-1 
                  flex flex-col items-center 
                  cursor-pointer 
                  hover:text-[#49b0f2] 
                  max-w-20 
                  p-1 
                  rounded 
                  transition-all
                  ${isActive ? 'bg-blue-50 border-2 border-[#49b0f2] text-[#49b0f2]' : 'border-2 border-transparent'}
                `}
                aria-label={`Cambiar a mapa ${style.label}`}
                aria-pressed={isActive}
                type="button"
              >
                <div className="relative">
                  <img
                    className={`
                      rounded 
                      w-12 h-8 
                      m-1 
                      transition-transform
                      hover:scale-110
                      ${isActive ? 'ring-2 ring-[#49b0f2] ring-offset-1' : ''}
                    `}
                    src={style.preview}
                    alt={`Vista previa ${style.label}`}
                    loading="lazy"
                  />
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#49b0f2] rounded-full border-2 border-white" aria-hidden="true" />
                  )}
                </div>
                <span className="text-[9px] text-center mt-1 leading-tight">
                  {style.label}
                </span>
              </button>
            );
          })
        ) : (
          <div className="col-span-full text-center text-gray-500 text-xs py-4">
            No hay estilos de mapa disponibles
          </div>
        )}
      </div>
    </div>
  );
};
