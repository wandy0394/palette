import PaletteGenerator from "../model/paletteGenerator"
import { Colour, HEX, Palette, Scheme } from "../types/colours"
import {useState, useEffect, useCallback} from 'react'
import PaletteGrid from "../components/PaletteGrid"
import ErrorBoundary from "../components/ErrorBoundary"
import { Result } from "../model/common/error"


type Props = {
    dominantColour:HEX
    generator: PaletteGenerator
}

export default function ColourScheme(props:Props) {
    const {dominantColour, generator} = props
    const [palettes, setPalettes] = useState<Palette[]>([])

    useEffect(()=>{
        let result:Result<Palette[], string> = generator.generatePalettes(dominantColour)
        if (result.isSuccess()) {
            setPalettes(result.value)
        }
        else {
            console.error(result.error)
        }
    }, [dominantColour])


    return (
        <ErrorBoundary>
            <div className='w-full flex flex-col items-center justify-center gap-4 md:gap-16'>
                <PaletteGrid
                    initPalettes={palettes}
                    generatePalette={(dominantColour:HEX, verticies:Colour[])=>generator.generatePalette(dominantColour, verticies)} 
                    generator={generator}
                    />
            </div>
        </ErrorBoundary>
    )
}
