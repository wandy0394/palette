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
                            <div className='w-full flex flex-col border rounded  border-neutral-500'>
                                <div className='w-full flex items-center justify-end p-4 border border-solid border-red-400'>
                                    <button className='btn btn-sm btn-primary' onClick={()=>generateNewScheme(palette?.colourVerticies, index)}>Regen</button>
                                </div>
                                <div className='grid grid-cols-2 items-center justify-center gap-4 border border-solid border-red-400 justify-items-center'>
                                    <div className='w-full flex items-center justify-center gap-8 border border-solid border-blue-400 h-full flex-wrap'>
                                        {
                                            palette?.palette.map(colour=>{
                                                return (
                                                    <div className='flex flex-col gap-4 w-1/12 items-center'>
                                                        <ColouredSquare colour={colour}/>
                                                        <div className='prose-xl'>#{colour}</div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {/* <div className='w-1/2 rounded-full aspect-square bg-gradient-radial from-white border border-solid border-red-400'></div> */}
                                    <div style={{
                                            width:'50%', 
                                            aspectRatio:'1/1', 
                                            border:'1px solid', 
                                            borderRadius:'100%', 
                                            background:'radial-gradient(white, transparent 80%), conic-gradient(#ff0000, #ff0080, #ff00ff, #8000ff, #0000ff, #0080ff, #00ffff, #00ff80, #00ff00, #80ff00, #ffff00, #ff8000, #ff0000)',
                                            transform:'rotate(90deg)'
                                    }}>
                                    </div>
                                </div>
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