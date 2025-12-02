import { base, satelite, open_street, positron, google_streets, google_satelite_hybrid, mapa1,mapa2 } from './sources'

export const mapStyles = [  
    {
        id: 'map_base',
        label: 'Mapa base', 
        source: base,
        preview: '/map_styles/preview/mapa_base.png',      
    },
    {
        id: 'map_satelite',
        label: 'Satelite', 
        source: satelite,
        preview: '/map_styles/preview/satelite.png',      
    },
    {
        id: 'map_open_street',
        label: 'Open Street', 
        source: open_street,
        preview: '/map_styles/preview/openstreet.png',      
    },
    {
        id: 'map_positron',
        label: 'Sin etiquetas', 
        source: positron,
        preview: '/map_styles/preview/sin_etiqueta.png',      
    },
    {
        id: 'map_google_streets',
        label: 'G. Streets', 
        source: google_streets,
        preview: '/map_styles/preview/google_streets.png',      
    },
    {
        id: 'map_google_satelite',
        label: 'G. Satelite', 
        source: google_satelite_hybrid ,
        preview: '/map_styles/preview/google_satelite.png',      
    },
    // {
    //     id: 'mapa1',
    //     label: 'Mapa 1', 
    //     source: mapa1 ,
    //     preview: '/map_styles/preview/mapa1.png',      
    // },
    // {
    //     id: 'mapa2',
    //     label: 'Mapa 2', 
    //     source: mapa2 ,
    //     preview: '/map_styles/preview/mapa2.png',      
    // },
];