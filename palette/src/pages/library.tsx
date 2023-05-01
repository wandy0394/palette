import { useNavigate } from "react-router-dom";
import ContentBox from "../components/common/ContentBox";
import PaletteSwatch from "../components/PaletteSwatch";
import { useAuthContext } from "../hooks/useAuthContext";
import useLibrary from "../hooks/useLibrary";
import LibraryService from "../service/library-service";
import { SavedPalette } from "../types/library";
import { useEffect, useState } from 'react'


function SavedPaletteEntry(props:{savedPalette:SavedPalette, handleDeleteClick:(uuid:string)=>void}) {
    const {savedPalette, handleDeleteClick} = props
    const navigate = useNavigate()

    function handleEditClick() {
        navigate('/editor/'+savedPalette.uuid)
    }
    function handleVisualiseClick() {
        navigate('/visualiser', {state:savedPalette.palette})
    }
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
                            onClick={handleEditClick}
                            >
                            Edit
                        </button>
                        <button 
                            className='btn btn-xs lg:btn-md btn-secondary' 
                            onClick={handleVisualiseClick}
                            >
                            Visualise
                        </button>
                        <button className='btn btn-xs lg:btn-md btn-secondary' 
                            onClick={()=>handleDeleteClick(savedPalette.uuid)}
                            >
                            Delete
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

export default function Library() {
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
    


    function handleDeleteClick(paletteUUID:string) {
        //call api service to delete
        async function deletePalette() {
            try {
                await LibraryService.deletePalette(paletteUUID)
                const newPalette:SavedPalette[] = library.savedPalette.filter(savedPalette=>savedPalette.uuid !== paletteUUID)
                setLibrary({...library, savedPalette:newPalette})
            }
            catch (e) {
                console.log('Could not delete')
            }
        }
        deletePalette();
    }

    return (
        <ContentBox finishedLoading={pageLoaded}>
            {
                (library.savedPalette.length <= 0) &&
                (<section className='text-2xl h-screen'>You have no palettes saved.</section>)
            }
            <div className='w-full min-h-screen'>
                <div className='w-full grid lg:grid-cols-2 gap-16 py-16'>
                {
                    
                    (library.savedPalette.length > 0) &&
                    library.savedPalette.map((savedPalette, index)=>{
                        return <SavedPaletteEntry 
                            key={'palette'+index} 
                            savedPalette={savedPalette} 
                            handleDeleteClick={()=>handleDeleteClick(savedPalette.uuid)}
                        />
                    })
                }
                </div>
            </div>
        </ContentBox>
    )
}