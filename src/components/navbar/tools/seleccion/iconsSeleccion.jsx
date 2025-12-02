import seleccionarIcon from "./icons/seleccionar.png";
import selecAtributosIcon from "./icons/selec_atributos.png";
import selectUbicacionIcon from './icons/selec_ubicacion.png';
import borrarIcon from './icons/borrar.png';
import exportarIcon from './icons/exportar.png';

// Tamaños de iconos
const ICON_SIZE_STANDARD = 36;
const ICON_SIZE_SMALL = 20;

/**
 * Iconos para herramientas de selección y opciones
 * Usado en: Toolbar de selección o panel de atributos
 */
export const icons = [
  // --- Selección ---
  {
    section: "seleccion",
    label: "Seleccionar",
    action: "select_features",
    tooltip: "Seleccionar features en el mapa",
    svg: (
      <img
        src={seleccionarIcon}
        alt="Seleccionar features"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "seleccion",
    label: "Seleccionar por atributos",
    action: "select_by_attributes",
    tooltip: "Seleccionar features usando filtros de atributos",
    svg: (
      <img
        src={selecAtributosIcon}
        alt="Seleccionar por atributos"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "seleccion",
    label: "Seleccionar por ubicación",
    action: "select_by_location",
    tooltip: "Seleccionar features por relación espacial",
    svg: (
      <img
        src={selectUbicacionIcon}
        alt="Seleccionar por ubicación"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "seleccion",
    label: "Borrar",
    action: "clear_selection",
    tooltip: "Limpiar selección actual",
    svg: (
      <img
        src={borrarIcon}
        alt="Limpiar selección"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  // --- Opciones ---
  {
    section: "opciones",
    label: "Exportar",
    action: "export_selection",
    tooltip: "Exportar features seleccionadas",
    svg: (
      <img
        src={exportarIcon}
        alt="Exportar selección"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  }
];

// Validación en desarrollo
if (import.meta.env.DEV) {
  icons.forEach((icon, index) => {
    if (!icon.section) {
      console.warn(`⚠️ Ícono en índice ${index} no tiene 'section'`);
    }
    if (!icon.label) {
      console.warn(`⚠️ Ícono en índice ${index} (section: ${icon.section}) no tiene 'label'`);
    }
    if (!icon.svg) {
      console.warn(`⚠️ Ícono '${icon.label}' no tiene 'svg'`);
    }
    if (!icon.action) {
      console.warn(`⚠️ Ícono '${icon.label}' no tiene 'action' definida`);
    }
  });
}

// Helper para obtener ícono por acción
export const getIconByAction = (action) => {
  return icons.find(icon => icon.action === action);
};

// Helper para obtener iconos por sección
export const getIconsBySection = (section) => {
  return icons.filter(icon => icon.section === section);
};

// Exportar constantes para uso en otros componentes
export { ICON_SIZE_STANDARD, ICON_SIZE_SMALL };
