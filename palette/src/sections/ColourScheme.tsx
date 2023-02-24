import PaletteGenerator from "../model/paletteGenerator"
import ColourConverter from "../model/colourConverter"
import { HEX, SchemeOutput } from "../types/colours"
import ColouredSquare from "../components/ColouredSquare"
import {useState, useEffect} from 'react'
import SchemeGrid from "../components/SchemeGrid"


type Props = {
    rgb:HEX
    generator: PaletteGenerator
}

export default function ColourScheme(props:Props) {
    const {rgb, generator} = props
    const [schemes, setSchemes] = useState<SchemeOutput>({schemes:[[]]})
    
    useEffect(()=>{
        setSchemes(generator.generateScheme(rgb))
    }, [rgb])


    return (
        <div className='w-full flex flex-col items-center justify-center gap-4'>
            <SchemeGrid schemes={schemes}/>
        </div>
    )
}
