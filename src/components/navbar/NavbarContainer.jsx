import { useState, useCallback, useRef } from "react";
import { MapaToolBar } from "./tools/mapa/MapaToolBar";
import { SeleccionToolBar } from "./tools/seleccion/SeleccionToolBar";
import { EdicionToolBar } from "./tools/edicion/EdicionToolBar";
import { ProyectoToolbar } from "./tools/proyecto/ProyectoToolbar";

const NAV_ITEMS = [
  { id: 'mapa', label: 'Mapa', component: MapaToolBar },
  { id: 'seleccion', label: 'Selección', component: SeleccionToolBar },
  { id: 'edicion', label: 'Edición', component: EdicionToolBar },
  { id: 'proyecto', label: 'Proyecto', component: ProyectoToolbar },
];

export const NavbarContainer = ({ userName = "Usuario", projectInfo }) => {
  const [activeTabId, setActiveTabId] = useState('mapa');
  const tabRefs = useRef([]);

  // Handler para cambiar tab
  const handleTabChange = useCallback((tabId) => {
    setActiveTabId(tabId);
  }, []);

  // Navegación por teclado (flechas izquierda/derecha)
  const handleKeyDown = useCallback((e, currentIndex) => {
    let newIndex = currentIndex;
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : NAV_ITEMS.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < NAV_ITEMS.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = NAV_ITEMS.length - 1;
        break;
      default:
        return;
    }
    setActiveTabId(NAV_ITEMS[newIndex].id);
    tabRefs.current[newIndex]?.focus();
  }, []);

  // Obtener el componente activo
  const ActiveToolbar = NAV_ITEMS.find(item => item.id === activeTabId)?.component;

  return (
    <div className="w-full z-[1000] bg-gray-200">
      {/* Navbar principal */}
      <nav 
        className="w-full px-4 bg-gray-200 shadow-sm flex justify-between items-center h-[52px]"
        aria-label="Navegación principal"
      >
        {/* IZQUIERDA */}
        <div className="flex items-center h-full gap-8 select-none">
          <h1 className="text-xl font-bold text-[#004874] whitespace-nowrap mr-8 p-0 m-0 leading-[52px]">
            PangeaCo
          </h1>
          {/* Tabs */}
          <div 
            className="flex items-end gap-1"
            role="tablist"
            aria-label="Secciones de herramientas"
          >
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeTabId === item.id;
              return (
                <button
                  key={item.id}
                  ref={(el) => (tabRefs.current[index] = el)}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${item.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabChange(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`
                    relative px-4 py-1
                    transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[#49b0f2] focus:ring-inset
                    ${isActive
                      ? 'text-[#49b0f2] bg-white font-medium border-x border-gray-300 after:absolute after:top-0 after:left-0 after:w-full after:h-0.5 after:bg-[#49b0f2]'
                      : 'text-gray-700 hover:text-[#49b0f2] hover:bg-gray-100'
                    }
                  `}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* CENTRO - Información del proyecto (opcional) */}
        {projectInfo && (
          <div className="flex flex-col justify-center text-center">
            <p className="text-sm font-medium text-gray-800">
              {projectInfo.name}
            </p>
            <p className="text-xs text-gray-500">
              Código: {projectInfo.code}
            </p>
          </div>
        )}

        {/* DERECHA - Usuario */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-800" aria-label="Usuario actual">
            {userName}
          </span>
          {/* Aquí podrías agregar un menú desplegable de usuario */}
        </div>
      </nav>

      {/* Sub-navbar con toolbars */}
      <div 
        className="w-full bg-white border-b border-gray-300 select-none"
        role="tabpanel"
        id={`tabpanel-${activeTabId}`}
        aria-labelledby={`tab-${activeTabId}`}
      >
        {ActiveToolbar && (
          <div className="flex justify-start">
            <ActiveToolbar />
          </div>
        )}
      </div>
    </div>
  );
};
