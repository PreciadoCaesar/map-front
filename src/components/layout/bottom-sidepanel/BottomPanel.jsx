import { useLocalState } from '../../../context/CleanLocalState'
import { TableContent } from './table/TableContent'

export const BottomPanel = () => {
  const { openPanel, setOpenPanel} = useLocalState()

  return (
    <>
        <div
            className={`
                absolute bottom-0 h-[250px] bg-white z-[950] border-2 border-t-0 border-gray-400/70 mx-2
                ${openPanel.left  ? 'left-[250px]' : 'left-0'}
                ${openPanel.right ? 'right-[320px]' : 'right-0'}
                ${!openPanel.bottom && 'hidden'}
            `}
        >
            <TableContent />
        </div>


        {!openPanel.bottom && (
            <button onClick={()=>setOpenPanel(prev => ({...prev,bottom: true}))}
             className={` bg-white absolute bottom-[-10px] md:bottom-[-9px] py-0.5 px-1 h-[40px] left-1/2 border-t border-b hover:bg-[#49b0f2]
                 border-gray-300 rounded z-[950] border-r rounded-l-none cursor-pointer rotate-270`
             }
            >
                {"➧"}
            </button>
        )}
    </>
  )
}
