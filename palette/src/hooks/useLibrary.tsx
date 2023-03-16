import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { SavedPalette } from "../types/library";

type Props = {
    userEmail:string
}
export default function useLibrary(props:Props) : [SavedPalette[], Dispatch<SetStateAction<SavedPalette[]>>] {
    const {userEmail} = props
    const [library, setLibrary] = useState<SavedPalette[]>([])

    useEffect(()=>{
        //make api call that gets the library for a particular userEmail
        //if the userEmail does not exist, throw an error
    }, [])


    return [library, setLibrary]
}