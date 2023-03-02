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

    // function arrangePalette(schemes:Scheme[], swatches:HEX[][]):HEX[][] | undefined {
    //     if (schemes === null || schemes === undefined) return
    //     if (swatches === null || schemes === undefined) return            
    //     if (schemes.schemes.length !== swatches.length) return

    //     let newPalettes:HEX[][] = []

    //     for (let i = 0; i < schemes.schemes.length; i++) {
    //         let palette:HEX[] = []
    //         for (let j = 0; j < schemes.schemes[i].length; j++) {
    //             palette.push(schemes.schemes[i][j])
    //         }
    //         for (let k = 0; k < swatches[i].length; k++) {
    //             palette.push(swatches[i][k])
    //         }
    //         newPalettes.push(palette)
    //     }
    //     return newPalettes
    // }

    // useEffect(()=>{
    //     let newPalettes:HEX[][] | undefined = arrangePalette(schemes, swatches)
    //     if (newPalettes !== undefined) {
    //         setPalettes(newPalettes)
    //         setErrorMessage('')
    //     }
    //     else {
    //         setPalettes([[]])
    //         setErrorMessage(errorString)
    //     }
    // }, [schemes, swatches])

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