import { HEX, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import { useState, useEffect, useRef } from 'react'
import {Chrome, ColorResult} from '@uiw/react-color'
import { GithubPlacement } from '@uiw/react-color-github';
import Wheel from '@uiw/react-color-wheel'
import ColourWheelPicker from "./ColourWheelPicker";

type Props = {
    initPalette: Scheme
}


export default function PaletteSwatchEditor(props:Props) {
    const{initPalette} = props
    const [palette, setPalette] = useState<Scheme>(initPalette)
    const [visible, setVisible] = useState<boolean>(false)
    const [chosenColour, setChosenColor] = useState<HEX>('')
    const [chosenIndex, setChosenIndex] = useState<number>()
    const ref = useRef(null)

    function setColour(colour:string, index:number) {
        if (palette) {
            let newPalette:Scheme = {...palette}
            let newSwatch:HEX[] = [...palette.palette]
            newSwatch[index] = colour.slice(1, -2)
            newPalette.palette = newSwatch
            setPalette(newPalette)
            setChosenColor(colour)
        }
    }

    
    function showColourPicker(colour:HEX, index:number) {
        setVisible(true)
        setChosenColor(colour)
        setChosenIndex(index)
    }

    useEffect(()=>{
        setPalette(initPalette)
    }, [initPalette])

    return (
        <div className='w-full flex items-center justify-center gap-4 h-full '>

            <div className='w-full flex items-center justify-center gap-8 h-full flex-wrap'>
                {
                    palette?.palette.map((colour, index)=>{
                        return (
                            <div className='flex flex-col gap-4 w-1/12 items-center'>
                                <ColouredSquare colour={colour} onSelect={()=>showColourPicker(colour, index)}/>
                                <div className='prose-xl'>#{colour}</div>
                            </div>
                        )
                    })
                }
                
                
            </div>
            <div className='w-full border border-solid border-red-400 h-full flex items-center justify-center'>
                <ColourWheelPicker/>
                {/* {
                    (chosenColour && (chosenIndex as number >= 0)) &&
                        <Wheel
                            color={chosenColour}
                            style={{width:'200px', height:'200px'}}
                            onChange={(color) => {
                                setColour(color.hexa, chosenIndex as number);
                            }}
                            // style={{display:visible?'block':'none'}}
                            />
                    
                } */}
            </div>
        </div>
    )
}