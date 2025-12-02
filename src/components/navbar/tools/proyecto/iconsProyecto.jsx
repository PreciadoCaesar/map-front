import proyectoIcon from "./icons/proyecto.png";
import validarProyectoIcon from "./icons/validar_proyecto.png";

// Tamaño estándar de iconos
const ICON_SIZE = 35;

/**
 * Iconos para la barra de herramientas de proyecto
 * Usado en: Toolbar de proyecto o panel de validación
 */
export const icons = [
  {
    section: "proyecto",
    label: "Proyecto",
    action: "open_project", // Acción asociada
    svg: (
      <img
        src={proyectoIcon}
        alt="Abrir proyecto"
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "validar",
    label: "Validar Proyecto",
    action: "validate_project", // Acción asociada
    svg: (
      <img
        src={validarProyectoIcon}
        alt="Validar proyecto actual"
        width={ICON_SIZE}
        height={ICON_SIZE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
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
