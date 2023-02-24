import PaletteGenerator from "../model/paletteGenerator"
import ColourConverter from "../model/colourConverter"
import { HEX, SchemeOutput } from "../types/colours"
import ColouredSquare from "../components/ColouredSquare"
import {useState, useEffect} from 'react'

const pg = new PaletteGenerator(new ColourConverter)
type Props = {
    rgb:HEX
}

export default function ComplementaryScheme(props:Props) {
    const {rgb} = props
    const [schemes, setSchemes] = useState<SchemeOutput>({schemes:[[]]})
    
    useEffect(()=>{
        setSchemes(pg.getComplementaryScheme(rgb))
    }, [rgb])


    return (
        <div className='w-full flex items-center justify-center gap-4'>
            {
                (schemes !== null) && (
                    schemes.schemes.map(scheme=>{
                        return scheme.map(colour=>{
                            return (
                                <div className='flex flex-col gap-4 w-full items-center'>
                                    <ColouredSquare colour={colour}/>
                                    <div className='prose-xl'>#{colour}</div>
                                </div>
                            )
                        })
    
                    })
                )
            }
        </div>
    )
}
