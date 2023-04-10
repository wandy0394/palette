import LibraryService from "../service/library-service"
import { SavedPalette } from "../types/library"
import { useState, useEffect } from 'react'

type Props = {
    paletteId:string|undefined
}

type Palette = {
    palette:SavedPalette[]
    finishedLoading:boolean
}

export default function useGetPaletteById(props:Props):[Palette, React.Dispatch<React.SetStateAction<Palette>>] {
    const {paletteId} = props
    const [palette, setPalette] = useState<Palette>({
        palette:[],
        finishedLoading:false
    })

    useEffect(()=>{
        if (paletteId) {
            //get palette by id
            async function get() {
                try {
                    const savedPalette:SavedPalette[] = await LibraryService.getPaletteById(paletteId as string)
                    setPalette({palette:savedPalette, finishedLoading:true})
                }
                catch (e) {
                    console.error(e)
                    setPalette({...palette, finishedLoading:true})
                }
            }
            get()
        }
        else {
            console.log('no params or paletteId')
            setPalette({...palette, finishedLoading:true})
        }

    }, [])

    return [palette, setPalette]

}