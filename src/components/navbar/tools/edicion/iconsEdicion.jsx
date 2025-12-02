import pararEdicion from "./icons/parar_edicion.png";
import servicioImplanacionIcon from './icons/servicio_implantacion.png'
import puntoAccesoIcon from './icons/punto_acceso.png'
import anclaIcon from './icons/ancla.png'
import ductoIcon from './icons/ducto.png'
import mensajeroInfraesIcon from './icons/mensajero_infraestructura.png'
import crucetaIcon from './icons/cruceta.png'
import soporteIcon from './icons/soporte.png'
import terminalIcon from './icons/terminal.png'
import cableIcon from './icons/cable.png'
import coberturaIcon from './icons/cobertura.png'
import bornesIcon from './icons/bornes.png'
import validarProyectoIcon from './icons/validar_proyecto.png'

const ICON_SIZE_LARGE = 35;
const ICON_SIZE_SMALL = 22;

export const icons = [
  /* Editar */
  {
    section: "editar",
    label: "Parar edición",
    mode: "simple_select",
    layer: null, // No dibuja, solo selecciona
    svg: (
      <img
        src={pararEdicion}
        alt="Parar edición"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "editar",
    label: "Servicio de implantación",
    mode: "draw_polygon",
    layer: "servicio_implantacion",
    svg: (
      <img
        src={servicioImplanacionIcon}
        alt="Servicio de implantación"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  /* Infraestructura */
  {
    section: "infraestructura",
    label: "Punto de acceso",
    cols: "row-span-3 flex-col items-center",
    mode: "draw_point",
    layer: "punto_acceso",
    svg: (
      <img
        src={puntoAccesoIcon}
        alt="Punto de acceso"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "infraestructura",
    label: "Ancla",
    cols: "",
    mode: "draw_point",
    layer: "ancla",
    svg: (
      <img
        src={anclaIcon}
        alt="Ancla"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "infraestructura",
    label: "Ducto",
    cols: "col-start-2 row-start-2",
    mode: "draw_line_string",
    layer: "ducto",
    svg: (
      <img
        src={ductoIcon}
        alt="Ducto"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "infraestructura",
    label: "C. mensajero",
    cols: "col-start-2 row-start-3",
    mode: "draw_line_string",
    layer: "mensajero",
    svg: (
      <img
        src={mensajeroInfraesIcon}
        alt="C. mensajero"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "infraestructura",
    label: "Cruceta",
    cols: "col-start-3 row-start-1",
    mode: "draw_point",
    layer: "cruceta",
    svg: (
      <img
        src={crucetaIcon}
        alt="Cruceta"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "infraestructura",
    label: "Soporte",
    cols: "col-start-3 row-start-2 min-w-[62px] mr-1",
    mode: "draw_point",
    layer: "soporte",
    svg: (
      <img
        src={soporteIcon}
        alt="Soporte"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  /* Red */
  {
    section: "red",
    label: "Terminal",
    mode: "draw_point",
    layer: "terminal",
    svg: (
      <img
        src={terminalIcon}
        alt="Terminal"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "red",
    label: "Cable",
    mode: "draw_line_string",
    layer: "cable",
    svg: (
      <img
        src={cableIcon}
        alt="Cable"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "red",
    label: "Cobertura",
    mode: "draw_polygon",
    layer: "cobertura",
    svg: (
      <img
        src={coberturaIcon}
        alt="Cobertura"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: "red",
    label: "Borner",
    mode: "draw_point",
    layer: "borner",
    svg: (
      <img
        src={bornesIcon}
        alt="Borner"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  /* Validar */
  {
    section: "validar",
    label: "Validar Proyecto",
    mode: null, // Acción especial, no es un modo de dibujo
    layer: null,
    svg: (
      <img
        src={validarProyectoIcon}
        alt="Validar Proyecto"
        width={ICON_SIZE_LARGE}
        height={ICON_SIZE_LARGE}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
];

// Validación en desarrollo
if (process.env.NODE_ENV === 'development') {
  icons.forEach((icon, index) => {
    if (!icon.section) {
      console.warn(`Ícono en índice ${index} no tiene 'section'`);
    }
    if (!icon.label) {
      console.warn(`Ícono en índice ${index} no tiene 'label'`);
    }
    if (!icon.svg) {
      console.warn(`Ícono '${icon.label}' no tiene 'svg'`);
    }
  });
}
