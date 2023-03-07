import { HEX, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import { useState, useEffect, useRef } from 'react'
import {Chrome, ColorResult} from '@uiw/react-color'
import { GithubPlacement } from '@uiw/react-color-github';
import Wheel from '@uiw/react-color-wheel'
import ColourWheelPicker from "./ColourWheelPicker";

type Props = {
    initPalette: Scheme
    chosenColour:{rgb:HEX, index:number}
    showColourPicker: (colour:HEX, index:number) => void
}


export default function PaletteSwatchEditor(props:Props) {
    const{initPalette, chosenColour, showColourPicker} = props
    const [palette, setPalette] = useState<Scheme>(initPalette)


    useEffect(()=>{
        setPalette(initPalette)
    }, [initPalette])

    return (
        <div className='w-full flex items-center justify-center gap-4 h-full '>

            <div className='w-full flex items-center justify-center gap-4 h-full flex-wrap'>
                {
                    palette?.palette.map((colour, index)=>{
                        return (
                            <div className='flex flex-col p-1 gap-4 w-1/12 items-center' style={{border:(chosenColour.index===index)?'2px solid white':''}}>
                                <ColouredSquare colour={colour.rgb} onSelect={()=>showColourPicker(colour.rgb, index)}/>
                                <div className='prose-xl'>#{colour.rgb}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}