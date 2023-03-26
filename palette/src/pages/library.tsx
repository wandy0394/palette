import { useNavigate } from "react-router-dom";
import ContentBox from "../components/common/ContentBox";
import PaletteSwatch from "../components/PaletteSwatch";
import { useAuthContext } from "../hooks/useAuthContext";
import useLibrary from "../hooks/useLibrary";
import LibraryService from "../service/library-service";
import { Palette } from "../types/colours";
import { SavedPalette } from "../types/library";

const DUMMY_EMAIL:string = 'dev@email.com'

function SavedPaletteEntry(props:{savedPalette:SavedPalette, handleDeleteClick:(id:number)=>void}) {
    const {savedPalette, handleDeleteClick} = props
    const navigate = useNavigate()

    function handleEditClick() {
        navigate('/editor/'+savedPalette.id, {state:{...savedPalette.palette}})
    }

    
    return (
        <div className='flex flex-col gap-4 items-center justify-center w-full h-full'>
            <div className='w-full flex items-center justify-between py-4'>
                <h2>{savedPalette.name}, ID:{savedPalette.id}</h2>
                
                <div className='flex gap-4'>
                    <button className='btn btn-xs lg:btn-md btn-primary' onClick={handleEditClick}>Edit</button>
                    <button className='btn btn-xs lg:btn-md btn-secondary' onClick={()=>handleDeleteClick(savedPalette.id)}>Delete</button>
                </div>
            </div>
            <PaletteSwatch palette={savedPalette.palette}/>
        </div>
    )
}

export default function Library() {
    const {user} = useAuthContext()
    const [library, setLibrary] = useLibrary({userId: user?.user.id})

    


    function handleDeleteClick(paletteId:number) {
        //call api service to delete
        async function deletePalette() {
            try {
                await LibraryService.deletePalette(user.user.email, user.user.id, paletteId)
                const newLibrary:SavedPalette[] = library.filter(savedPalette=>savedPalette.id !== paletteId)
                setLibrary(newLibrary)
            }
            catch (e) {
                console.log('Could not delete')
            }
        }
        deletePalette();
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
                    return <SavedPaletteEntry savedPalette={savedPalette} handleDeleteClick={()=>handleDeleteClick(savedPalette.id)}/>
                })
            }
            </div>
        </ContentBox>
    )
}