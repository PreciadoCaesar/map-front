import { useEffect } from 'react';
import { Source, Layer } from 'react-map-gl/maplibre';
import { useSelector } from 'react-redux';

export const GeographicMapLayers = () => {
    const { departamentos, provincias, distritos, visibility } = useSelector(
        (state) => state.geographicReducer
    );

    return (
        <>
            {/* Departamentos */}
            {departamentos && (
                <Source id="departamentos-source" type="geojson" data={departamentos}>
                    <Layer
                        id="departamentos-fill"
                        type="fill"
                        paint={{
                            'fill-color': '#088',
                            'fill-opacity': visibility.departamentos ? 0.3 : 0,
                        }}
                    />
                    <Layer
                        id="departamentos-line"
                        type="line"
                        paint={{
                            'line-color': '#088',
                            'line-width': 2,
                            'line-opacity': visibility.departamentos ? 1 : 0,
                        }}
                    />
                    <Layer
                        id="departamentos-label"
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'nombre'],
                            'text-size': 12,
                            'text-anchor': 'center',
                            'visibility': visibility.departamentos ? 'visible' : 'none',
                        }}
                        paint={{
                            'text-color': '#000',
                            'text-halo-color': '#fff',
                            'text-halo-width': 1,
                        }}
                    />
                </Source>
            )}

            {/* Provincias */}
            {provincias && (
                <Source id="provincias-source" type="geojson" data={provincias}>
                    <Layer
                        id="provincias-fill"
                        type="fill"
                        paint={{
                            'fill-color': '#f59e0b',
                            'fill-opacity': visibility.provincias ? 0.2 : 0,
                        }}
                    />
                    <Layer
                        id="provincias-line"
                        type="line"
                        paint={{
                            'line-color': '#f59e0b',
                            'line-width': 1.5,
                            'line-opacity': visibility.provincias ? 1 : 0,
                        }}
                    />
                    <Layer
                        id="provincias-label"
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'nombre'],
                            'text-size': 10,
                            'text-anchor': 'center',
                            'visibility': visibility.provincias ? 'visible' : 'none',
                        }}
                        paint={{
                            'text-color': '#000',
                            'text-halo-color': '#fff',
                            'text-halo-width': 1,
                        }}
                    />
                </Source>
            )}

            {/* Distritos */}
            {distritos && (
                <Source id="distritos-source" type="geojson" data={distritos}>
                    <Layer
                        id="distritos-fill"
                        type="fill"
                        paint={{
                            'fill-color': '#8b5cf6',
                            'fill-opacity': visibility.distritos ? 0.15 : 0,
                        }}
                    />
                    <Layer
                        id="distritos-line"
                        type="line"
                        paint={{
                            'line-color': '#8b5cf6',
                            'line-width': 1,
                            'line-opacity': visibility.distritos ? 1 : 0,
                        }}
                    />
                    <Layer
                        id="distritos-label"
                        type="symbol"
                        layout={{
                            'text-field': ['get', 'nombre'],
                            'text-size': 8,
                            'text-anchor': 'center',
                            'visibility': visibility.distritos ? 'visible' : 'none',
                        }}
                        paint={{
                            'text-color': '#000',
                            'text-halo-color': '#fff',
                            'text-halo-width': 1,
                        }}
                    />
                </Source>
            )}
        </>
    );
};
