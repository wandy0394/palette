import PaletteGenerator from "../model/paletteGenerator"
import { Colour, HEX, Palette, Scheme } from "../types/colours"
import {useState, useEffect} from 'react'
import PaletteGrid from "../components/PaletteGrid"
import ErrorBoundary from "../components/ErrorBoundary"
import { Result } from "../model/common/error"


type Props = {
    rgb:HEX
    generator: PaletteGenerator
}

export default function ColourScheme(props:Props) {
    const {rgb, generator} = props
    const [palettes, setPalettes] = useState<Palette[]>([])
    
    useEffect(()=>{
        let result:Result<Palette[], string> = generator.generatePalettes(rgb)
        if (result.isSuccess()) {
            setPalettes(result.value)
        }
        else {
            console.error(result.error)
        }
    }, [rgb])


    return (
        <ErrorBoundary>
            <div className='w-full flex flex-col items-center justify-center gap-4 md:gap-16'>
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
        </ErrorBoundary>
    )
}
