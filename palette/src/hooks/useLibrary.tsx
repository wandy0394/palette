import { useState, Dispatch, SetStateAction, useEffect } from "react";
import LibraryService from "../service/library-service";
import { SavedPalette } from "../types/library";
import { useAuthContext } from "./useAuthContext";

type Props = {
    token:string
}

type Library = {
    savedPalette:SavedPalette[]
    finishedLoading:boolean
}

export default function useLibrary(props:Props) : [Library, Dispatch<SetStateAction<Library>>] {
    // const [library, setLibrary] = useState<SavedPalette[]>([])
    const [library, setLibrary] = useState<Library>({
        savedPalette:[],
        finishedLoading:false
    })

    useEffect(()=>{
        //make api call that gets the library
        async function getPalettes() {
            try{
                const result = await LibraryService.getPalettes()
                
                setLibrary({savedPalette:result, finishedLoading:true})
            }
            catch(error) {
                // handle error
                setLibrary({...library, finishedLoading:true})
            }
        }
        getPalettes();
    }, [])


    return [library, setLibrary]
}