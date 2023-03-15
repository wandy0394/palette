import { Colour, HEX, Palette, Scheme } from "../types/colours"
import {useEffect, useState } from 'react'
import ColourConverter from "../model/colourConverter"
import PaletteSwatch from "./PaletteSwatch"
import PaletteGenerator from "../model/paletteGenerator"
import ColourWheel from "./ColourWheel"
import ValueSlider from "./ValueSlider"
import { useNavigate } from "react-router-dom"
import ErrorBoundary from "./ErrorBoundary"
import { Result } from "../model/common/error"

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
    const [values, setValues] = useState<number[]>([])
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

    function updateValue(newValue:number, index:number) {
        let newValues:number[] = [...values]
        newValues[index] = newValue
        setValues(newValues)
    }

    function editPalette(palette:Palette) {
        navigate('/editor', {state:palette})
    }

    useEffect(()=>{
        setPalettes(initPalettes)
        let newValues:number[] = []
        for (let i = 0; i < initPalettes.length; i++) {
            newValues.push(100)
        }
        setValues(newValues)
    }, [initPalettes])


    return (
        <ErrorBoundary>
            <div className='w-full flex flex-col items-center justify-center gap-8'>
                {
                    (palettes) && (
                        palettes.map((palette, index)=>{
                            return (
                                <div key={`palette=${index}`} className='w-full flex flex-col border rounded  border-neutral-500'>
                                    <div className='w-full flex items-center justify-end gap-4 p-4'>
                                        <button className='btn btn-xs btn-primary md:btn-sm' onClick={()=>generateNewScheme(palette.mainColour, palette?.colourVerticies, index)}>Randomize</button>
                                        <button className='btn btn-xs btn-secondary md:btn-sm' onClick={()=>editPalette(palette)}>Edit</button>
                                    </div>

                                    <div className='w-full grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center justify-center gap-4 justify-items-center pb-8'>
                                        <PaletteSwatch palette={palette}/>
                                        <div className='h-full w-full flex items-center justify-center gap-8 border border-solid border-orange-500'>
                                            <ColourWheel palette={palette} colourValue={values[index]}/>
                                            <ValueSlider value={values[index]} updateValue={(value)=>updateValue(value, index)}/>
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