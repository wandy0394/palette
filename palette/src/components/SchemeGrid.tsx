import { HEX, HSV, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import {useEffect, useState, MouseEventHandler} from 'react'
import ColourConverter from "../model/colourConverter"

const cc = new ColourConverter()
type Props = {
    schemes:Scheme[], 
    generateScheme: (colour:HEX[]) => Scheme,
    rgb2hsv: (rgb:HEX) => HSV | null
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
    const {schemes, generateScheme, rgb2hsv} = props
    
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
                                    <div className='h-full w-full flex items-center justify-center gap-8 border border-solid border-red-400'>
                                        <div className='relative w-1/2 flex items-center justify-center aspect-square'>
                                            {
                                                wheelWidths.map((width, wheelIndex)=>{
                                                    
                                                    let saturation:number = (100-((wheelIndex+1)*2)) / 100
                                                    let wheelHSVs:HSV[] = getWheelHSV(saturation, values[index]/100)
                                                    let colours = getColourString(wheelHSVs)
                                                    return (
                                                        <div style={{
                                                            position:'absolute',
                                                            width:`${width}%`, 
                                                            aspectRatio:'1/1', 
                                                            borderRadius:'100%', 
                                                            background:`conic-gradient(${colours})`,
                                                            transform:'rotate(90deg)',
                                                            zIndex:`${wheelIndex}`
                                                        }}> 
                                                        </div>
                                                    )
                                                })
                                            }
                                            {
                                                palette?.colourVerticies.map(vertex=>{
                                                    let hsv:HSV|null = rgb2hsv(vertex)
                                                    if (hsv === null) return
                                                    let angle:number = Math.floor(hsv.hue) 
                                                    let radius:number = hsv.saturation * 1900 + 50
                                                    return (
                                                        <div className={`absolute w-full z-50`} style={{transform:`rotate(-${angle}deg)`}}>

                                                            <div className='w-[5%] aspect-square rounded-full border-gray-500 border-4' style={{transform:`translate(${radius}%)`}}>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        <div className='flex items-center justify-center rotate-[270deg]'>
                                            <input type='range' min="0" max="100" value={values[index]} className="range" onChange={e=>updateValue(parseInt(e.target.value), index)}/>
                                        </div>
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