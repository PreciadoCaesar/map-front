import { useState } from "react"
import { useLocalState } from "../../../context/CleanLocalState"
import { LayerContent } from "./layers/LayerContent";

export const LeftPanel = () => {
    const { openPanel = { left: false, right: false, bottom: false }, setOpenPanel } = useLocalState()
    const [mainButons, setMainButons] = useState({
        capas: true,
        leyend: false
    });
    
    return (
        <>
            <div className={`${!openPanel.left && 'hidden'} absolute w-[250px] h-[100dvh] bg-transparent left-0 z-[950]`}>
                <div className="relative top-[27%] md:top-[22%] py-2 bg-white h-full border-t-4 border-gray-400/70">
                    <div className="flex justify-between pr-2 items-center border-gray-400/70">
                        <h1 className="text-lg pl-1">Contenido</h1>
                        <span 
                            onClick={() => setOpenPanel(prev => ({ ...prev, left: !openPanel.left }))} 
                            className="text-gray-400 font-sans cursor-pointer px-1 rounded-sm hover:bg-red-300 hover:text-black"
                        >
                            X
                        </span>
                    </div>
                    <div className="flex mt-2 text-sm">
                        <button 
                            onClick={() => setMainButons({ capas: true, leyend: false })} 
                            className={`relative px-2 border-gray-300 cursor-pointer
                                ${mainButons.capas
                                    ? 'text-[#49b0f2] bg-white font-medium after:absolute after:-top-0.1 after:left-0 border-x after:w-full after:h-0.5 after:bg-[#49b0f2]'
                                    : 'text-gray-700 hover:text-[#49b0f2] border-b'}
                            `}
                        >
                            Capas
                        </button>
                        <button 
                            onClick={() => setMainButons({ capas: false, leyend: true })}
                            className={`relative px-2 border-gray-300 cursor-pointer
                                ${mainButons.leyend
                                    ? 'text-[#49b0f2] bg-white font-medium after:absolute after:-top-0.1 after:left-0 border-x after:w-full after:h-0.5 after:bg-[#49b0f2]'
                                    : 'text-gray-700 hover:text-[#49b0f2] border-b'}
                            `}
                        >
                            Leyenda
                        </button>
                        <span className="border-gray-300 border-b w-full"></span>
                    </div>
                    
                    {/* Capas */}
                    <LayerContent />
                    
                    {/* Leyend */}
                </div>
            </div>
            
            {!openPanel.left && (
                <button 
                    onClick={() => setOpenPanel(prev => ({ ...prev, left: true }))}
                    className="bg-white absolute px-0.5 py-2 top-1/2 border-t border-b hover:bg-[#49b0f2] border-gray-300 rounded z-[950] border-r rounded-l-none cursor-pointer"
                >
                    {"➧"}
                </button>
            )}
        </>
    )
}