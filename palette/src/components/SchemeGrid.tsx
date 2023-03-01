import { HEX, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import {useEffect, useState} from 'react'


const errorString:string = 'An error has occurred.'
export default function SchemeGrid(props:{swatches:Scheme[], schemes:HEX[][]}) {    
    const {schemes, swatches} = props
    
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
    useEffect(()=>{
        setPalettes(swatches)
    }, [schemes])

    return (
        <div className='w-full flex flex-col items-center justify-center gap-8'>
            {
                (palettes.length > 0) && (
                    palettes.map(palette=>{
                        return (
                            <div className='w-full flex items-center justify-center gap-8 py-8 px-8 border rounded  border-neutral-500'>
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