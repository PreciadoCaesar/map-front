import { useState, useMemo, useCallback } from 'react';
import { icons, getIconsBySection } from "./iconsProyecto";
import CenterModalNuevoProyecto from "./CenterModalNuevoProyecto";

export const ProyectoToolbar = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [projectState, setProjectState] = useState('');
  const [isNuevoProyectoOpen, setIsNuevoProyectoOpen] = useState(false);

  const proyectoIcons = useMemo(() => getIconsBySection('proyecto'), []);
  const validarIcons = useMemo(() => getIconsBySection('validar'), []);

  const handleIconClick = useCallback(
    (action, label) => {
      console.log(`Acción ejecutada: ${action} - ${label}`);

      switch (action) {
        case 'open_project':
          console.log('Abriendo proyecto...');
          break;

        case 'validate_project':
          console.log('Validando proyecto...');
          if (selectedProject === 'nuevo' && projectState === 'individual') {
            setIsNuevoProyectoOpen(true);
          } else {
            console.warn(
              'Para crear un nuevo proyecto desde validar, selecciona "Nuevo Proyecto" e "Individual".'
            );
          }
          break;

        default:
          console.warn(`Acción no implementada: ${action}`);
      }
    },
    [selectedProject, projectState]
  );

  const handleProjectChange = useCallback((e) => {
    setSelectedProject(e.target.value);
    console.log('Proyecto seleccionado:', e.target.value);
  }, []);

  const handleStateChange = useCallback((e) => {
    setProjectState(e.target.value);
    console.log('Estado cambiado a:', e.target.value);
  }, []);

  const renderIconSection = (sectionIcons, sectionName) => (
    <div
      className="border-r border-gray-300 pt-1 pr-2 flex flex-col h-full justify-between"
      role="group"
      aria-label={`Sección de ${sectionName}`}
    >
      <div className="flex items-center gap-2">
        {sectionIcons.map(({ label, svg, action }) => (
          <button
            key={action || label}
            type="button"
            onClick={() => handleIconClick(action, label)}
            className="flex flex-col items-center text-gray-700 hover:text-[#49b0f2] cursor-pointer w-[80px] h-full text-center p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#49b0f2] focus:ring-offset-2"
            aria-label={label}
          >
            <div className="flex items-center justify-center">{svg}</div>
            <span className="mt-1">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <nav
        className="flex items-center bg-white px-2 shadow-sm w-full text-[11px]"
        role="toolbar"
        aria-label="Barra de herramientas de proyecto"
      >
        {renderIconSection(proyectoIcons, 'proyecto')}
        <div className="border-r border-gray-300 pt-1 pr-2 flex flex-col h-full justify-between">
          <div className="flex items-center gap-2">
            {validarIcons.map(({ label, svg, action }) => (
              <button
                key={action || label}
                type="button"
                onClick={() => handleIconClick(action, label)}
                className="flex flex-col items-center text-gray-700 hover:text-[#49b0f2] cursor-pointer w-[80px] h-full text-center p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#49b0f2] focus:ring-offset-2"
                aria-label={label}
              >
                <div className="flex items-center justify-center">{svg}</div>
                <span className="mt-1">{label}</span>
              </button>
            ))}
            <div className="flex items-center gap-2 ml-2">
              <label
                htmlFor="crear-proyecto-select"
                className="text-gray-700 font-medium"
              >
                Crear Proyecto
              </label>
              <select
                id="crear-proyecto-select"
                name="crearProyecto"
                value={selectedProject}
                onChange={handleProjectChange}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#49b0f2] focus:border-transparent"
                aria-label="Seleccionar proyecto para crear"
              >
                <option value="">Seleccionar...</option>
                <option value="nuevo">Nuevo Proyecto</option>
                <option value="plantilla">Desde Plantilla</option>
                <option value="importar">Importar Proyecto</option>
              </select>
            </div>
          </div>
        </div>
        <div className="border-r border-gray-300 pr-2 h-full text-center">
          <div className="flex items-center p-2 h-full gap-2">
            <label htmlFor="cambiar-estado-select" className="sr-only">
              Cambiar estado del proyecto
            </label>
            <select
              id="cambiar-estado-select"
              name="cambiarEstado"
              value={projectState}
              onChange={handleStateChange}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#49b0f2] focus:border-transparent"
              aria-label="Cambiar estado del proyecto"
            >
              <option value="">Cambiar Estado</option>
              <option value="individual">Individual</option>
              <option value="grupal">Grupal</option>
              <option value="publico">Público</option>
              <option value="privado">Privado</option>
            </select>
          </div>
        </div>
      </nav>
      <CenterModalNuevoProyecto
        isOpen={isNuevoProyectoOpen}
        onClose={setIsNuevoProyectoOpen}
        onCreated={(proyecto) => {
          console.log('Proyecto creado desde modal:', proyecto);
        }}
      />
    </>
  );
};
