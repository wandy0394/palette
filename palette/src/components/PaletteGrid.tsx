import { Colour, HEX, Palette, Scheme } from "../types/colours"
import {useEffect, useState } from 'react'
import ColourConverter from "../model/colourConverter"
import PaletteGenerator from "../model/paletteGenerator"
import { useNavigate } from "react-router-dom"
import ErrorBoundary from "./ErrorBoundary"
import { Result } from "../model/common/error"
import PaletteRow from "./PaletteRow"

const cc = new ColourConverter()
type Props = {
    initPalettes:Palette[], 
    generatePalette: (rgb:HEX, colour:Colour[]) => Result<Palette,string>
    generator:PaletteGenerator
}

const errorString:string = 'An error has occurred.'

export default function PaletteGrid(props:Props) {    
    const {initPalettes, generatePalette, generator} = props
    const [palettes, setPalettes] = useState<Palette[]>(initPalettes)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const navigate = useNavigate()

    function generateNewScheme(mainColour:Colour, colourList:(Colour[]|undefined), index:number) {
        if (colourList === undefined) {
            setErrorMessage(errorMessage)   //redo this
            return
        }
        let result:Result<Palette, string> = generatePalette(mainColour.rgb, colourList)
        if (result.isSuccess()) {
            let newPalettes = [...palettes]
            if (newPalettes[index] === undefined) {
                setErrorMessage(errorMessage)
                return
            }
            setErrorMessage('')
            newPalettes[index] = result.value
            setPalettes(newPalettes)
        }
        else {
            console.error(result.error)
        }
    }

    function editPalette(palette:Palette) {
        navigate('/editor', {state:palette})
    }

    function visualisePalette(palette:Palette) {
        navigate('/visualiser', {state:palette})
    }

    useEffect(()=>{
        setPalettes(initPalettes)
    }, [initPalettes])


    return (
        <ErrorBoundary>
            <div className='w-full flex flex-col items-center justify-center gap-16 md:gap-24'>
                {
                    (palettes) && (
                        palettes.map((palette, index)=>{
                            return (
                                <div key={`palette=${index}`} className='w-full flex flex-col items-center' >
                                    <div  className='w-full lg:w-2/3 flex flex-col bg-base-300 shadow-lg'>
                                        <div className='w-full flex items-center'>
                                            <div className='w-full flex justify-start px-4'>
                                                <div className='text-lg lg:text-2xl font-bold'>
                                                    {generator.getName()} #{index+1}
                                                </div>
                                            </div>
                                            <div className='w-full flex flex-wrap items-center justify-end gap-4 p-4'>
                                                <button 
                                                    className='btn btn-xs btn-primary md:btn-sm' 
                                                    onClick={()=>generateNewScheme(palette.mainColour, palette?.colourVerticies, index)}
                                                >
                                                    Randomize
                                                </button>
                                                <button 
                                                    className='btn btn-xs btn-secondary md:btn-sm' 
                                                    onClick={()=>editPalette(palette)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className='btn btn-xs btn-secondary md:btn-sm' 
                                                    onClick={()=>visualisePalette(palette)}
                                                >
                                                    Visualise
                                                </button>
                                            </div>
                                        </div>

                                        <div className='w-full h-48 flex items-center justify-center gap-4 justify-items-center'>
                                            <PaletteRow palette={palette}/>
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
        </ErrorBoundary>
    )

}