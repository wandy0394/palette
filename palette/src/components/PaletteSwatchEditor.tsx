import { Colour, ColourRole, HEX, Palette, PaletteKey, Scheme } from "../types/colours"
import ColouredSquare from "./ColouredSquare"
import { useState, useEffect, useRef } from 'react'
import {Chrome, ColorResult} from '@uiw/react-color'
import { GithubPlacement } from '@uiw/react-color-github';
import Wheel from '@uiw/react-color-wheel'
import ColourWheelPicker from "./ColourWheelPicker";
import ColouredBar from "./ColouredBar";

type Props = {
    initPalette: Palette
    chosenColour:Colour
    chosenColourRole: ColourRole
    chosenColourIndex: number
    showColourPicker: (colour:Colour, index:number, key:PaletteKey) => void
}


export default function PaletteSwatchEditor(props:Props) {
    const{initPalette, chosenColour, chosenColourIndex, chosenColourRole, showColourPicker} = props
    const [palette, setPalette] = useState<Palette>(initPalette)


    useEffect(()=>{
        setPalette(initPalette)
    }, [initPalette])



    return (
        <div className='w-full grid grid-rows-2 gap-0 h-full flex-wrap'>

            <div className='w-full grid grid-cols-2 border border-solid border-red-500'>
                <div className='w-full items-center justify-center'>
                    <div className='flex flex-col w-full h-full items-center' style={{border:(chosenColourRole === 'mainColour')?'2px solid white':''}}>
                        <ColouredBar colour={palette.mainColour.rgb} onSelect={()=>showColourPicker(palette.mainColour, 0, 'mainColour')}/>
                        {/* <div className='prose-xl'>#{palette.mainColour.rgb}</div> */}
                    </div>
                </div>
                <div className='w-full flex items-center justify-center'>
                    {
                        palette?.accentColours.map((colour, index)=>{
                            return (
                                <div className='flex flex-col w-full h-full items-center' style={{border:(chosenColourIndex===index && chosenColourRole === 'accentColours')?'2px solid white':''}}>
                                    <ColouredBar colour={colour.rgb} onSelect={()=>showColourPicker(colour, index, 'accentColours')}/>
                                    {/* <div className='prose-xl'>#{colour.rgb}</div> */}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
                <div className='w-full flex items-center justify-center'>
                    {
                        palette?.supportColours.map((colour, index)=>{
                            return (
                                <div className='flex flex-col w-full h-full items-center' style={{border:(chosenColourIndex==index && chosenColourRole === 'supportColours')?'2px solid white':''}}>
                                    <ColouredBar colour={colour.rgb} onSelect={()=>showColourPicker(colour, index, 'supportColours')}/>
                                    {/* <div className='prose-xl'>#{colour.rgb}</div> */}
                                </div>
                            )
                        })
                    }
                </div>
                {/* {
                    palette?.colourVerticies.map((colour, index)=>{
                        return (
                            <div className='flex flex-col p-1 gap-4 w-1/12 items-center' style={{border:(chosenColourIndex==index && chosenColourRole === 'colourVerticies')?'2px solid white':''}}>
                                <ColouredSquare colour={colour.rgb} onSelect={()=>{return}}/>
                                <div className='prose-xl'>#{colour.rgb}</div>
                            </div>
                        )
                    })
                } */}
        </div>
    )
}