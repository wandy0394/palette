import PaletteGenerator from "../model/paletteGenerator"
import { Colour, HEX, Palette, Scheme } from "../types/colours"
import {useState, useEffect} from 'react'
import PaletteGrid from "../components/PaletteGrid"


type Props = {
    rgb:HEX
    generator: PaletteGenerator
}

export default function ColourScheme(props:Props) {
    const {rgb, generator} = props
    const [schemes, setSchemes] = useState<Scheme[]>([])
    const [palettes, setPalettes] = useState<Palette[]>([])
    
    useEffect(()=>{
        let verticies:Colour[][] = generator.generateColourVerticies(rgb)
        let palettes:Palette[] = generator.generatePalettes(rgb)
        // let schemes:Scheme[] = generator.generateRandomSchemes(verticies)
        // setSchemes(schemes)
        setPalettes(palettes)
    }, [rgb])


    return (
        <div className='w-full flex flex-col items-center justify-center gap-16'>
            <div className="prose align-center">
                <h2 className='flex gap-2 items-center text-neutral-400'>
                    {generator.getName()} 
                </h2>
            </div>

            <PaletteGrid
                initPalettes={palettes}
                generatePalette={(rgb:HEX, verticies:Colour[])=>generator.generatePalette(rgb, verticies)} 
                generator={generator}
            />
        </div>
    )
}
