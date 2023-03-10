import { Colour, ColourRole, HEX, Palette, PaletteKey, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import { useState, useEffect, useRef } from 'react'
import {Chrome, ColorResult} from '@uiw/react-color'
import { GithubPlacement } from '@uiw/react-color-github';
import Wheel from '@uiw/react-color-wheel'
import ColourWheelPicker from "./ColourWheelPicker";

type Props = {
    initPalette: Palette
    chosenColour:Colour
    chosenColourRole: ColourRole
    showColourPicker: (colour:Colour, index:number, key:PaletteKey) => void
}


export default function PaletteSwatchEditor(props:Props) {
    const{initPalette, chosenColour, chosenColourRole, showColourPicker} = props
    const [palette, setPalette] = useState<Palette>(initPalette)


    useEffect(()=>{
        setPalette(initPalette)
    }, [initPalette])

    return (
        <div className='w-full flex items-center justify-center gap-4 h-full '>

            <div className='w-full flex items-center justify-center gap-4 h-full flex-wrap'>
                {
                    palette?.colourVerticies.map((colour, index)=>{
                        return (
                            <div className='flex flex-col p-1 gap-4 w-1/12 items-center' style={{border:(chosenColour.index===index && chosenColourRole === 'colourVerticies')?'2px solid white':''}}>
                                <ColouredSquare colour={colour.rgb} onSelect={()=>showColourPicker(colour, index, 'colourVerticies')}/>
                                <div className='prose-xl'>#{colour.rgb}</div>
                            </div>
                        )
                    })
                }
                {
                    palette?.supportColours.map((colour, index)=>{
                        return (
                            <div className='flex flex-col p-1 gap-4 w-1/12 items-center' style={{border:(chosenColour.index===index && chosenColourRole === 'supportColours')?'2px solid white':''}}>
                                <ColouredSquare colour={colour.rgb} onSelect={()=>showColourPicker(colour, index, 'supportColours')}/>
                                <div className='prose-xl'>#{colour.rgb}</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}