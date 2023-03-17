import { useNavigate } from "react-router-dom";
import ContentBox from "../components/common/ContentBox";
import PaletteSwatch from "../components/PaletteSwatch";
import useLibrary from "../hooks/useLibrary";
import { Palette } from "../types/colours";
import { SavedPalette } from "../types/library";

const DUMMY_EMAIL:string = 'dev@email.com'

function SavedPaletteEntry(props:{savedPalette:SavedPalette, handleDeleteClick:(id:number)=>void}) {
    const {savedPalette, handleDeleteClick} = props
    const navigate = useNavigate()

    function handleEditClick() {
        navigate('/editor', {state:{...savedPalette.palette, id:savedPalette.id}})
    }

    
    return (
        <div className='flex flex-col gap-4 items-center justify-center w-full h-full'>
            <div className='w-full flex items-center justify-between'>
                <h2>{savedPalette.name}</h2>
                <button className='btn btn-xs btn-primary' onClick={handleEditClick}>Edit</button>
                <button className='btn btn-xs btn-primary' onClick={()=>handleDeleteClick(savedPalette.id)}>Delete</button>
            </div>
            <PaletteSwatch palette={savedPalette.palette}/>
        </div>
    )
}

export default function Library() {
    const [library, setLibrary] = useLibrary({userEmail: DUMMY_EMAIL})

    


    function handleDeleteClick(id:number) {
        //call api service to delete
        
        const newLibrary:SavedPalette[] = library.filter(savedPalette=>savedPalette.id !== id)
        setLibrary(newLibrary)
    }

    /*



    */

    return (
        <ContentBox>
            {
                (library.length <= 0) &&
                    (<section className='text-2xl'>You have no palettes saved.</section>)
            }
            <div className='w-full h-screen grid lg:grid-cols-2 gap-8'>
            {
                
                (library.length > 0) &&
                library.map((savedPalette, index)=>{
                    return <SavedPaletteEntry savedPalette={savedPalette} handleDeleteClick={handleDeleteClick}/>
                })
            }
            </div>
        </ContentBox>
    )
}