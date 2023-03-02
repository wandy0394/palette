import { HEX, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import {useEffect, useState, MouseEventHandler} from 'react'

type Props = {
    schemes:Scheme[], 
    generateScheme: (colour:HEX[])=>Scheme
}

const errorString:string = 'An error has occurred.'
export default function SchemeGrid(props:Props) {    
    const {schemes, generateScheme} = props
    
    const [palettes, setPalettes] = useState<Scheme[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')

    function generateNewScheme(colourList:(HEX[]|undefined), index:number) {
        if (colourList === undefined) {
            setErrorMessage(errorMessage)
            return
        }
        let swatch:Scheme = generateScheme(colourList)
        
        let newPalettes = [...palettes]
        if (newPalettes[index] === undefined) {
            setErrorMessage(errorMessage)
            return
        }
        setErrorMessage('')
        newPalettes[index] = swatch
        setPalettes(newPalettes)
        return
    }


    useEffect(()=>{
        setPalettes(schemes)
    }, [schemes])

    return (
        <div className='w-full flex flex-col items-center justify-center gap-8'>
            {
                (palettes.length > 0) && (
                    palettes.map((palette, index)=>{
                        return (
                            <div className='w-full flex items-center justify-center gap-8 py-8 px-8 border rounded  border-neutral-500'>
                                <button className='btn btn-sm btn-primary' onClick={()=>generateNewScheme(palette?.colourVerticies, index)}>Regen</button>
                                {
                                    palette?.palette.map(colour=>{
                                        return (
                                            <div className='flex flex-col gap-4 w-full items-center'>
                                                <ColouredSquare colour={colour}/>
                                                <div className='prose-xl'>#{colour}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                )
            }
            <div className='text-red-500'>
                {errorMessage}
            </div>
        </div>
    )

}