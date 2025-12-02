import { useLocalState } from "../../../context/CleanLocalState"

export const RightPanel = () => {
    const {openPanel, setOpenPanel} = useLocalState()
  return (
    <>
        <div className={`${!openPanel.right && 'hidden' } absolute w-[320px] h-[100dvh]  bg-transparent right-0 z-[950]`}>
            <div className="relative top-[27%] md:top-[22%] py-2 bg-white h-full border-t-4  border-gray-400/70 ">
                <div className="flex justify-between pr-2 items-center">
                    <h1 className="text-lg pl-1">Contenido</h1>
                    <span onClick={()=>setOpenPanel(prev =>({...prev, right: !openPanel.right}))} className="text-gray-400 font-sans cursor-pointer px-1 rounded-sm hover:bg-red-300 hover:text-black">X</span>
                </div>

            </div>
        </div>
        {!openPanel.right && (
            <button onClick={()=>setOpenPanel(prev => ({...prev,right: true}))}
             className={` bg-white absolute px-0.5 py-2 top-1/2 border-t border-b hover:bg-[#49b0f2]
                 border-gray-300 rounded z-[950] border-r rounded-l-none cursor-pointer rotate-180 right-0`
             }
            >
                {"➧"}
            </button>
        )}
    </>
  )
}
