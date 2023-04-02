import { useState, Dispatch, SetStateAction, useEffect } from "react";
import LibraryService from "../service/library-service";
import { SavedPalette } from "../types/library";
import { useAuthContext } from "./useAuthContext";

type Props = {
    token:string
}
export default function useLibrary(props:Props) : [SavedPalette[], Dispatch<SetStateAction<SavedPalette[]>>] {
    const {token} = props
    const [library, setLibrary] = useState<SavedPalette[]>([])
    useEffect(()=>{
        //make api call that gets the library for a particular userId
        //if the userId does not exist, throw an error
        if (token) {
            async function getPalettes() {
                try{
                    const result = await LibraryService.getPalettes(token)
                    setLibrary(result)
                }
                catch(e) {
                    console.error('Api call failed:' + e)
                }
            }
            getPalettes();
        }
    }, [])


    return [library, setLibrary]
}