import { useState, useMemo, useCallback } from 'react';
import { icons, getIconsBySection } from "./iconsSeleccion";

export const SeleccionToolBar = () => {
  const [activeSelection, setActiveSelection] = useState(null);

  // Optimizar filtrado de iconos
  const seleccionIcons = useMemo(() => getIconsBySection('seleccion'), []);
  const opcionesIcons = useMemo(() => getIconsBySection('opciones'), []);

  // Handler para clicks
  const handleIconClick = useCallback((action, label) => {
    console.log(`Herramienta seleccionada: ${action} - ${label}`);
    
    // Implementar lógica según la acción
    switch (action) {
      case 'select_features':
        setActiveSelection('select_features');
        console.log('Modo de selección activado');
        break;
      case 'select_by_attributes':
        setActiveSelection('select_by_attributes');
        console.log('Abriendo diálogo de selección por atributos...');
        break;
      case 'select_by_location':
        setActiveSelection('select_by_location');
        console.log('Abriendo diálogo de selección por ubicación...');
        break;
      case 'clear_selection':
        setActiveSelection(null);
        console.log('Limpiando selección...');
        break;
      case 'export_selection':
        console.log('Exportando selección...');
        break;
      default:
        console.warn(`Acción no implementada: ${action}`);
    }
  }, []);

  // Renderizar sección de iconos
  const renderIconSection = (sectionIcons, sectionName) => (
    <div 
      className="border-r border-gray-300 pr-2 flex flex-col h-full justify-between"
      role="group"
      aria-label={`Herramientas de ${sectionName}`}
    >
      <div className="flex items-center gap-2">
        {sectionIcons.map(({ label, svg, action }) => {
          const isActive = activeSelection === action;
          const isBorrarButton = label === 'Borrar';

          return (
            <button
              key={action || label}
              type="button"
              onClick={() => handleIconClick(action, label)}
              className={`
                ${isBorrarButton ? 'flex' : 'flex flex-col'} 
                items-center 
                w-[80px] 
                h-full 
                text-center 
                cursor-pointer 
                transition-colors
                ${isActive 
                  ? 'text-[#49b0f2] bg-blue-100 border-2 border-[#49b0f2]' 
                  : 'text-gray-700 hover:text-[#49b0f2] border-2 border-transparent'
                }
                p-1 
                rounded
                focus:outline-none 
                focus:ring-2 
                focus:ring-[#49b0f2] 
                focus:ring-offset-2
              `}
              aria-label={label}
              aria-pressed={isActive}
              title={icons.find(i => i.action === action)?.tooltip || label}
            >
              <div className="flex items-center justify-center">
                {svg}
              </div>
              <span className="mt-1">{label}</span>
            </button>
          );
        })}
      </div>
      <span className="text-[12px] text-center text-gray-700 capitalize px-2 py-1">
        {sectionName}
      </span>
    </div>
  );

  return (
    <nav 
      className="flex items-center bg-white px-2 shadow-sm w-full text-[11px]"
      role="toolbar"
      aria-label="Barra de herramientas de selección"
    >
      {/* Sección Selección */}
      {renderIconSection(seleccionIcons, 'selección')}

      {/* Sección Opciones */}
      {renderIconSection(opcionesIcons, 'opciones')}
    </nav>
  );
};
