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
        navigate('/editor/'+savedPalette.id)
    }

    
    return (
        <div className='bg-base-300 shadow-lg flex flex-col items-center justify-center w-full h-1/2'>
            <div className='w-full flex items-center justify-between py-4'>
                <div className='w-full flex justify-start px-8'>
                    <h2 className='text-2xl font-bold'>{savedPalette.name}</h2>
                </div>
                <div className='flex gap-4 pr-8'>
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
    const [library, setLibrary] = useLibrary({userId: user?.user.id, token:user?.token})

    


    function handleDeleteClick(paletteId:number) {
        //call api service to delete
        async function deletePalette() {
            try {
                await LibraryService.deletePalette(user.user.email, user.user.id, paletteId, user.token)
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
            <div className='w-full h-screen grid lg:grid-cols-2 gap-16 py-16'>
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