import PaletteGenerator from "../model/paletteGenerator"
import ColourConverter from "../model/colourConverter"
import { HEX, Scheme } from "../types/colours"
import ColouredSquare from "../components/ColouredSquare"
import {useState, useEffect} from 'react'
import SchemeGrid from "../components/SchemeGrid"


type Props = {
    rgb:HEX
    generator: PaletteGenerator
}

export default function ColourScheme(props:Props) {
    const {rgb, generator} = props
    const [schemes, setSchemes] = useState<HEX[][]>([])
    const [swatches, setSwatches] = useState<Scheme[]>([])
    
    useEffect(()=>{
        let schemes:HEX[][] = generator.generateSchemes(rgb)
        let swatches:Scheme[] = generator.generateRandomSwatches(schemes)
        console.log(schemes)
        console.log(swatches)
        setSchemes(schemes)
        setSwatches(swatches)
    }, [rgb])


    function generateSwatch() {
        //setSwatches(generator.generateRandomSwatch(rgb))
    }

    return (
        <div className='w-full flex flex-col items-center justify-center gap-16'>
            <div className="prose align-center">
                <h2 className='flex gap-2 items-center'>
                    {generator.getName()} 
                    <div className="btn btn-primary btn-xs" onClick={generateSwatch}>Regen</div>
                </h2>
            </div>
            
            <SchemeGrid schemes={schemes} swatches={swatches}/>

        </div>
    )
}
