import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchDepartamentos,
    fetchProvincias,
    fetchDistritos,
    toggleLayerVisibility,
} from '../../../../redux/features/geographicSlice';

export const GeographicLayers = () => {
    const dispatch = useDispatch();
    const { visibility, loading } = useSelector((state) => state.geographicReducer);

    useEffect(() => {
        // Cargar capas al montar el componente
        dispatch(fetchDepartamentos());
        dispatch(fetchProvincias());
        dispatch(fetchDistritos());
    }, [dispatch]);

    const handleToggle = (layer) => {
        dispatch(toggleLayerVisibility(layer));
    };

    return (
        <div className="mt-2 space-y-1">
            <div className="px-2">
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2">
                    Cartografía
                </h3>

                {/* Departamentos */}
                <div className="flex items-center justify-between py-1 hover:bg-gray-100 rounded px-1">
                    <label className="flex items-center cursor-pointer flex-1">
                        <input
                            type="checkbox"
                            checked={visibility.departamentos}
                            onChange={() => handleToggle('departamentos')}
                            className="mr-2"
                            disabled={loading.departamentos}
                        />
                        <span className="text-sm">
                            {loading.departamentos ? '⏳ Cargando...' : '🗺️ Departamentos'}
                        </span>
                    </label>
                </div>

                {/* Provincias */}
                <div className="flex items-center justify-between py-1 hover:bg-gray-100 rounded px-1">
                    <label className="flex items-center cursor-pointer flex-1">
                        <input
                            type="checkbox"
                            checked={visibility.provincias}
                            onChange={() => handleToggle('provincias')}
                            className="mr-2"
                            disabled={loading.provincias}
                        />
                        <span className="text-sm">
                            {loading.provincias ? '⏳ Cargando...' : '📍 Provincias'}
                        </span>
                    </label>
                </div>

                {/* Distritos */}
                <div className="flex items-center justify-between py-1 hover:bg-gray-100 rounded px-1">
                    <label className="flex items-center cursor-pointer flex-1">
                        <input
                            type="checkbox"
                            checked={visibility.distritos}
                            onChange={() => handleToggle('distritos')}
                            className="mr-2"
                            disabled={loading.distritos}
                        />
                        <span className="text-sm">
                            {loading.distritos ? '⏳ Cargando...' : '📌 Distritos'}
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};
