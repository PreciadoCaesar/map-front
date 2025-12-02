const base = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

const satelite = "https://api.maptiler.com/maps/satellite/style.json?key=7E7fFAcuUoQg6PSA3UVF";

const open_street = `https://api.maptiler.com/maps/openstreetmap/style.json?key=${import.meta.env.VITE_API_KEY_OPEN_STREET}`;

const positron = "https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json";

const google_streets = "/map_styles/google_streets.json";

const google_satelite_hybrid = "/map_styles/google_satelite_hybrid.json";

const mapa1 = "/map_styles/mapa1.json"

const mapa2 = "/map_styles/mapa2.json"

export {
    base,
    satelite,
    open_street,
    positron,
    google_streets,
    google_satelite_hybrid,
    mapa1,
    mapa2
}