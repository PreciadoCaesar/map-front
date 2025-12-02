import explorarIcon from './icons/explorar.png';
import marcadoresIcon from './icons/marcadores.png';
import irAIcon from './icons/ir_a.png';
import mapaBaseIcon from './icons/mapa_base.png';
import agregarDatosIcon from './icons/agregarDatos.png';
import listadoCapasIcon from './icons/listado_capa.png';
import distanciaIcon from './icons/distancia.png';
import areaPerimetroIcon from './icons/area_perimetro.png';
import generarPDFIcon from './icons/generar_pdf.png';
import capturarMapaIcon from './icons/capturar_mapa.png';
import cargarAdjIcon from './icons/cargar_adj.png';
import descargasIcon from './icons/descargas.png';
import variosIcon from './icons/varios.png';
import borrarIcon from './icons/borrar.png';

// Tamaños de iconos
const ICON_SIZE_STANDARD = 26;
const ICON_SIZE_SMALL = 18;
const ICON_SIZE_VARIOS = { width: 50, height: 35 };

export const icons = [
  // --- Navegar ---
  {
    section: 'navegar',
    label: 'Explorar',
    svg: (
      <img
        src={explorarIcon}
        alt="Explorar mapa"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'navegar',
    label: 'Varios',
    svg: (
      <img
        src={variosIcon}
        alt="Opciones varias"
        width={ICON_SIZE_VARIOS.width}
        height={ICON_SIZE_VARIOS.height}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'navegar',
    label: 'Marcadores ▼',
    isDropdown: true,
    svg: (
      <img
        src={marcadoresIcon}
        alt="Menú de marcadores"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'navegar',
    label: 'Ir a',
    svg: (
      <img
        src={irAIcon}
        alt="Ir a ubicación"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  // --- Capa ---
  {
    section: 'capa',
    label: 'Mapa base ▼',
    isDropdown: true,
    svg: (
      <img
        src={mapaBaseIcon}
        alt="Seleccionar mapa base"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'capa',
    label: 'Agregar datos ▼',
    isDropdown: true,
    svg: (
      <img
        src={agregarDatosIcon}
        alt="Agregar datos al mapa"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'capa',
    label: 'Listado de capas',
    svg: (
      <img
        src={listadoCapasIcon}
        alt="Ver listado de capas"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  // --- Medición ---
  {
    section: 'medicion',
    label: 'Distancia',
    svg: (
      <img
        src={distanciaIcon}
        alt="Medir distancia"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'medicion',
    label: 'Área y perímetro',
    svg: (
      <img
        src={areaPerimetroIcon}
        alt="Medir área y perímetro"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'medicion',
    label: 'Borrar',
    svg: (
      <img
        src={borrarIcon}
        alt="Borrar mediciones"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  // --- Exportar ---
  {
    section: 'exportar',
    label: 'Generar PDF',
    svg: (
      <img
        src={generarPDFIcon}
        alt="Generar PDF del mapa"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'exportar',
    label: 'Capturar mapa',
    svg: (
      <img
        src={capturarMapaIcon}
        alt="Capturar imagen del mapa"
        width={ICON_SIZE_STANDARD}
        height={ICON_SIZE_STANDARD}
        className="object-contain"
        loading="lazy"
      />
    ),
  },

  // --- Masivo ---
  {
    section: 'masivo',
    label: 'Cargar Adj.',
    svg: (
      <img
        src={cargarAdjIcon}
        alt="Cargar adjuntos"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
        className="object-contain"
        loading="lazy"
      />
    ),
  },
  {
    section: 'masivo',
    label: 'Descargas',
    svg: (
      <img
        src={descargasIcon}
        alt="Ver descargas"
        width={ICON_SIZE_SMALL}
        height={ICON_SIZE_SMALL}
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
  });

  
}
export const getIconsBySection = (section) =>
  icons.filter((icon) => icon.section === section);

