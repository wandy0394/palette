import { HEX, HSV, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import {useEffect, useState, MouseEventHandler} from 'react'
import ColourConverter from "../model/colourConverter"
import PaletteSwatch from "./PaletteSwatch"
import PaletteGenerator from "../model/paletteGenerator"
import ColourWheel from "./ColourWheel"
import ValueSlider from "./ValueSlider"

const cc = new ColourConverter()
type Props = {
    schemes:Scheme[], 
    generateScheme: (colour:HEX[]) => Scheme,
    rgb2hsv: (rgb:HEX) => HSV | null,
    generator:PaletteGenerator
}

const errorString:string = 'An error has occurred.'
function range (start:number, stop:number, step:number):number[] {
    let output:number[] = []
    if (start >= stop) {
        for (let i = start; i > stop; i+=step) {
            output.push(i)
        }
    }
    else {
        for (let i = stop; i < stop; i+=step) {
            output.push(i)
        }
    }
    return output
}

function getWheelHSV(saturation:number, value:number): HSV[] {
    let output:HSV[] = []
    output.push({
        hue:0, 
        saturation:saturation,
        value:value
    })
    for (let i = 330; i >= 0; i-= 30) {
        output.push({
            hue:i, 
            saturation:saturation,
            value:value
        })
    }
    return output
}
function getColourString(colours:HSV[]):string {
    let output:string = ''

    colours.forEach(colour=>{
        output += (`#${cc.hsv2rgb(colour)}, `)
    })
    output = output.slice(0, -2)
    return output
}



const wheelWidths:number[] = range(100, 0, -2)

export default function SchemeGrid(props:Props) {    
    const {schemes, generateScheme, rgb2hsv, generator} = props
    
    const [palettes, setPalettes] = useState<Scheme[]>([])
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [values, setValues] = useState<number[]>([])

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

    function updateValue(newValue:number, index:number) {
        let newValues:number[] = [...values]
        newValues[index] = newValue
        setValues(newValues)
    }

    function editPalette() {
        //save chosen palette to sessionStorage, then redirect to /editor
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
                                    <button className='btn btn-sm btn-secondary'>Edit</button>
                                </div>
                                <div className='grid grid-cols-2 items-center justify-center gap-4 justify-items-center pb-8'>
                                    <PaletteSwatch palette={palette}/>
                                    <div className='h-full w-full flex items-center justify-center gap-8'>
                                        <ColourWheel palette={palette?.palette} colourVerticies={palette?.colourVerticies} generator={generator} colourValue={values[index]}/>
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