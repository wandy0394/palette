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
    const [verticies, setVerticies] = useState<HEX[][]>([])
    const [schemes, setSchemes] = useState<Scheme[]>([])
    
    useEffect(()=>{
        let verticies:HEX[][] = generator.generateColourVerticies(rgb)
        let schemes:Scheme[] = generator.generateRandomSchemes(verticies)
        setSchemes(schemes)
        setVerticies(verticies)
    }, [rgb])


    return (
        <div className='w-full flex flex-col items-center justify-center gap-16'>
            <div className="prose align-center">
                <h2 className='flex gap-2 items-center text-neutral-400'>
                    {generator.getName()} 
                </h2>
            </div>
            
            <SchemeGrid 
                schemes={schemes} 
                generateScheme={(verticies:HEX[])=>generator.generateRandomScheme(verticies)} 
                rgb2hsv={(rgb:HEX)=>generator.converter.rgb2hsv(rgb)}
                generator={generator}
            />

        </div>
    )
}
