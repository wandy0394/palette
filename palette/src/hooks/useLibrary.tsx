import { useState, Dispatch, SetStateAction, useEffect } from "react";
import LibraryService from "../service/library-service";
import { SavedPalette } from "../types/library";

type Props = {
    userEmail:string
}
const DUMMY_EMAIL = "dev@dev.com"
export default function useLibrary(props:Props) : [SavedPalette[], Dispatch<SetStateAction<SavedPalette[]>>] {
    const {userEmail} = props
    const [library, setLibrary] = useState<SavedPalette[]>([])

    useEffect(()=>{
        //make api call that gets the library for a particular userEmail
        //if the userEmail does not exist, throw an error
        async function getPalettes() {
            try{
                const result = await LibraryService.getPalettes(DUMMY_EMAIL)
                // console.log(result)
                setLibrary(result)
            }
            catch(e) {
                console.error('Api call failed')
            }
        }
        getPalettes();
    }, [])


    return [library, setLibrary]
}