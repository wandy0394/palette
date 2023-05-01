type Props = {
    loadPaletteHandler:(palette:Palette)=>void
}

import { useNavigate } from "react-router-dom";
import ContentBox from "../components/common/ContentBox";
import PaletteSwatch from "../components/PaletteSwatch";
import { useAuthContext } from "../hooks/useAuthContext";
import useLibrary from "../hooks/useLibrary";
import LibraryService from "../service/library-service";
import { SavedPalette } from "../types/library";
import { useEffect, useState } from 'react'
import { Palette } from "../types/colours";


function SavedPaletteEntry(props:{savedPalette:SavedPalette, handleLoadClick:()=>void}) {
    const {savedPalette, handleLoadClick} = props

    return (
        <ContentBox>
            <div className='bg-base-300 shadow-lg flex flex-col items-center justify-center w-full h-full'>
                
                <div className='w-full flex items-center justify-between py-2 md:py-4'>
                    <div className='w-full flex justify-start px-8'>
                        <h2 className='text-lg md:text-2xl font-bold'>{savedPalette.name}</h2>
                    </div>
                    <div className='flex gap-4 pr-8'>
                        <button 
                            className='btn btn-xs lg:btn-md btn-primary' 
                            onClick={handleLoadClick}
                            >
                            Load
                        </button>
                    </div>
                </div>
                <div className='w-full h-24 md:h-40'>
                    <PaletteSwatch palette={savedPalette.palette}/> 
                </div>
            </div>
        </ContentBox>
    )
}

export default function LibraryModal(props:Props) {
    const {loadPaletteHandler} = props

    const {user, finishedLoading} = useAuthContext()
    const [library, setLibrary] = useLibrary({token:user?.token})
    const [pageLoaded, setPageLoaded] = useState<boolean>(false)

    function loadPage() {
        if (finishedLoading && library.finishedLoading) {
            setPageLoaded(true)
        }
    }

    useEffect(()=>{
        loadPage()
    }, [finishedLoading, library.finishedLoading])
    


    function handleLoadClick(palette:Palette) {
        loadPaletteHandler(palette)
    }

    return (
        <ContentBox finishedLoading={pageLoaded}>
            {
                (library.savedPalette.length <= 0) &&
                (<section className='text-2xl'>You have no palettes saved.</section>)
            }
            <div className='w-full h-full px-8'>
                <div className='w-full grid lg:grid-cols-2 gap-16 py-16'>
                {
                    
                    (library.savedPalette.length > 0) &&
                    library.savedPalette.map((savedPalette, index)=>{
                        return <SavedPaletteEntry 
                            key={'palette'+index} 
                            savedPalette={savedPalette} 
                            handleLoadClick={()=>handleLoadClick(savedPalette.palette)}
                        />
                    })
                }
                </div>
            </div>
        </ContentBox>
    )
}