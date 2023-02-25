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
    const [swatch, setSwatch] = useState<HEX[]>([])
    
    useEffect(()=>{
        setSchemes(generator.generateScheme(rgb))
        setSwatch(generator.generateRandomSwatch(rgb))
    }, [rgb])


    function generateSwatch() {
        setSwatch(generator.generateRandomSwatch(rgb))
    }

    return (
        <div className='w-full flex flex-col items-center justify-center gap-16'>
            <div className="prose align-center">
                <h2 className='flex gap-2 items-center'>
                    {generator.getName()} 
                    <div className="btn btn-primary btn-xs" onClick={generateSwatch}>Regen</div>
                </h2>
            </div>
            
            <SchemeGrid schemes={schemes}/>
            <div className='w-full flex gap-4'>
                {
                    swatch.map(colour=>{
                        return(
                            <div className='flex flex-col justify-center items-center w-full'>
                                <ColouredSquare colour={colour}/>
                                <p>{colour}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
