import { Colour, HEX, HSV, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import {useEffect, useState, MouseEventHandler} from 'react'
import ColourConverter from "../model/colourConverter"
import PaletteSwatch from "./PaletteSwatch"
import PaletteGenerator from "../model/paletteGenerator"
import ColourWheel from "./ColourWheel"
import ValueSlider from "./ValueSlider"
import useSessionStorage from "../hooks/useSessionStorage"
import { useNavigate } from "react-router-dom"

const cc = new ColourConverter()
type Props = {
    schemes:Scheme[], 
    generateScheme: (colour:Colour[]) => Scheme,
    rgb2hsv: (rgb:HEX) => HSV | null,
    generator:PaletteGenerator
}

const errorString:string = 'An error has occurred.'

export default function SchemeGrid(props:Props) {    
    const {schemes, generateScheme, rgb2hsv, generator} = props
    const [palettes, setPalettes] = useState<Scheme[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [values, setValues] = useState<number[]>([])
    const navigate = useNavigate()

    function generateNewScheme(colourList:(Colour[]|undefined), index:number) {
        if (colourList === undefined) {
            setErrorMessage(errorMessage)   //redo this
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

    function updateValue(newValue:number, index:number) {
        let newValues:number[] = [...values]
        newValues[index] = newValue
        setValues(newValues)
    }

    function editPalette(palette:Scheme) {
        navigate('/editor', {state:palette})
    }

    useEffect(()=>{
        setPalettes(schemes)
        let newValues:number[] = []
        for (let i = 0; i < schemes.length; i++) {
            newValues.push(100)
        }
        setValues(newValues)
    }, [schemes])


    return (
        <div className='w-full flex flex-col items-center justify-center gap-8'>
            {
                (palettes.length > 0) && (
                    palettes.map((palette, index)=>{
                        return (
                            <div className='w-full flex flex-col border rounded  border-neutral-500'>
                                <div className='w-full flex items-center justify-end gap-4 p-4'>
                                    <button className='btn btn-sm btn-primary' onClick={()=>generateNewScheme(palette?.colourVerticies, index)}>Randomize</button>
                                    <button className='btn btn-sm btn-secondary' onClick={()=>editPalette(palette)}>Edit</button>
                                </div>
                                <div className='grid grid-cols-2 items-center justify-center gap-4 justify-items-center pb-8'>
                                    <PaletteSwatch palette={palette}/>
                                    <div className='h-full w-2/3 flex items-center justify-center gap-8'>
                                        <ColourWheel scheme={palette} generator={generator} colourValue={values[index]}/>
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
    )

}