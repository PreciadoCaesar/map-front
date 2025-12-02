import { useLocalState } from '@/context/CleanLocalState'
import { useSelector } from 'react-redux'

export default function useHandleClickSelect() {
    const {setPolygonSelected} = useLocalState()
    const mapBoxDrawStateRef = useSelector(state => state.mapBoxDrawStateRef)

    const handleclickSelect = ()=>{
        const select = mapBoxDrawStateRef?.getSelected()

        if(!select?.features.length){
          setPolygonSelected(null)
          return
        } 

        setPolygonSelected(select);
      }
    return {handleclickSelect}
}
