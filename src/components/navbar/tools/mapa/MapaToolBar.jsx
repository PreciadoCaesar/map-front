import { icons } from './IconsMap'
import { useLocalState } from '../../../../context/CleanLocalState'
import { BaseMapLayer } from './capa/basemap-style/BaseMapLayer'
import { useSelector } from 'react-redux'

export const MapaToolBar = () => {
  const { activeMapTool, setActiveMapTool } = useLocalState()
  const mapRef = useSelector(state => state?.mapReducer?.mapref)
  
  const handleToggle = (label) => {
    // Si es el botón Explorar, ir a ubicación real
    if (label === 'Explorar') {
      if (mapRef && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const map = mapRef.getMap() // Obtener instancia de MapLibre
            map.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15,
              duration: 2000,
              essential: true
            })
            
            // Opcional: Agregar un marcador en tu ubicación
            const el = document.createElement('div')
            el.className = 'location-marker'
            el.style.backgroundColor = '#4285F4'
            el.style.width = '20px'
            el.style.height = '20px'
            el.style.borderRadius = '50%'
            el.style.border = '3px solid white'
            el.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)'
            
            new maplibregl.Marker(el)
              .setLngLat([position.coords.longitude, position.coords.latitude])
              .addTo(map)
          },
          (error) => {
            console.error('Error obteniendo ubicación:', error)
            let mensaje = 'No se pudo obtener tu ubicación.'
            
            if (error.code === 1) {
              mensaje = 'Debes permitir el acceso a tu ubicación en el navegador.'
            } else if (error.code === 2) {
              mensaje = 'No se pudo determinar tu ubicación. Intenta de nuevo.'
            } else if (error.code === 3) {
              mensaje = 'Tiempo de espera agotado. Intenta de nuevo.'
            }
            
            alert(mensaje)
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        )
      } else if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización.')
      }
      return // No activar el toggle para Explorar
    }
    
    setActiveMapTool(prev => ({
      ...prev,
      [label]: !prev[label],
    }))
  }
  
  const renderSection = (sectionName) => (
    <div key={sectionName} className="border-r border-gray-300 flex flex-col h-full justify-between">
      <div className="flex items-center">
        {icons
          .filter(icon => icon.section === sectionName)
          .map(({ label, svg }) => {
            const isActive = !!activeMapTool[label]
            return (
              <button
                key={label}
                onClick={() => handleToggle(label)}
                className={`
                  flex flex-col items-center w-[69px] text-[11px]
                  cursor-pointer
                  ${isActive ? ' text-[#49b0f2] bg-blue-100' : 'text-gray-700 hover:text-[#49b0f2]'}
                  p-1 rounded
                `}
              >
                {svg}
                <span className="mt-1">{label}</span>
              </button>
            )
          })}
      </div>
      <span className="text-[12px] text-center text-gray-700 capitalize">
        {sectionName}
      </span>
    </div>
  )
  
  return (
    <>
      <div className="flex items-start bg-white shadow-sm w-auto overflow-x-auto custom-scrollbar">
        {['navegar', 'capa', 'medicion', 'exportar', 'masivo'].map(sec =>
          renderSection(sec)
        )}
      </div>
      <BaseMapLayer />
    </>
  )
}