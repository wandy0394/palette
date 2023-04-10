import LibraryService from "../service/library-service"
import { SavedPalette } from "../types/library"
import { useState, useEffect } from 'react'

type Props = {
    paletteId:string|undefined
}

type Palette = {
    palette:SavedPalette[]
    finishedLoading:boolean
    redirect:boolean
}

export default function useGetPaletteById(props:Props):[Palette, React.Dispatch<React.SetStateAction<Palette>>] {
    const {paletteId} = props
    const [palette, setPalette] = useState<Palette>({
        palette:[],
        finishedLoading:false,
        redirect:false
    })



    async function getFromApi() {
        try {
            const savedPalette:SavedPalette[] = await LibraryService.getPaletteById(paletteId as string)
            if (savedPalette.length == 0) {
                //if no palette is returned, the paletteId is invalid, redirect the user
                setPalette({palette:savedPalette, finishedLoading:true, redirect:true})
            }
            else {
                setPalette({palette:savedPalette, finishedLoading:true, redirect:false})
            }
        }
        catch (error) {
            console.error(error)
            //something has gone wrong, redirect user
            setPalette({...palette, finishedLoading:true, redirect:true})
        }
    }
    useEffect(()=>{
        if (paletteId) {
            //get palette by id
            
            getFromApi()
        }
        else {
            setPalette({...palette, finishedLoading:true, redirect:false})
        }

    }, [])

    return [palette, setPalette]

}