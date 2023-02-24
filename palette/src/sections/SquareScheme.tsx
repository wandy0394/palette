import PaletteGenerator from "../model/paletteGenerator"
import ColourConverter from "../model/colourConverter"
import { HEX, SchemeOutput } from "../types/colours"
import ColouredSquare from "../components/ColouredSquare"
import {useState, useEffect} from 'react'
import SchemeGrid from "../components/SchemeGrid"

const pg = new PaletteGenerator(new ColourConverter)
type Props = {
    rgb:HEX
}

export default function SquareScheme(props:Props) {
    const {rgb} = props
    const [schemes, setSchemes] = useState<SchemeOutput>({schemes:[[]]})
    
    useEffect(()=>{
        setSchemes(pg.getSquareScheme(rgb))
    }, [rgb])


    return (
        <div className='w-full flex items-center justify-center gap-4'>
            <SchemeGrid schemes={schemes}/>
        </div>
    )
}
