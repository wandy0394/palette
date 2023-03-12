import { Colour, Palette } from "../types/colours"
import { useState, useEffect, useRef } from 'react'
import ColouredBar from "./ColouredBar";
import {ACTION_TYPES, ColourState} from "../hooks/useChosenColour"

type Props = {
    state:ColourState
    showColourPicker: (colour:Colour, index:number, type:ACTION_TYPES) => void

}


export default function PaletteSwatchEditor(props:Props) {
    const {state, showColourPicker} = props
    const [palette, setPalette] = useState<Palette>(state.palette)


    useEffect(()=>{
        setPalette(state.palette)
    }, [state.palette])



    return (
        <div className='w-full grid grid-rows-2 gap-0 h-full flex-wrap'>
            <div className='w-full grid grid-cols-2 border border-solid border-red-500'>
                <div className='w-full items-center justify-center'>
                    <div className='flex flex-col w-full h-full items-center' style={{border:(state.role === ACTION_TYPES.UPDATE_MAINCOLOUR)?'2px solid white':''}}>
                        <ColouredBar colour={palette.mainColour.rgb} onSelect={()=>showColourPicker(palette.mainColour, 0, ACTION_TYPES.UPDATE_MAINCOLOUR)}/>
                        {/* <div className='prose-xl'>#{palette.mainColour.rgb}</div> */}
                    </div>
                </div>
                <div className='w-full flex items-center justify-center'>
                    {
                        palette?.accentColours.map((colour, index)=>{
                            return (
                                <div key={`accent-${index}`} className='flex flex-col w-full h-full items-center' style={{border:(state.index===index && state.role === ACTION_TYPES.UPDATE_ACCENTCOLOUR)?'2px solid white':''}}>
                                    <ColouredBar colour={colour.rgb} onSelect={()=>showColourPicker(colour, index, ACTION_TYPES.UPDATE_ACCENTCOLOUR)}/>
                                
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
                            <div key={`accent-${index}`} className='flex flex-col w-full h-full items-center' style={{border:(state.index===index && state.role === ACTION_TYPES.UPDATE_SUPPORTCOLOUR)?'2px solid white':''}}>
                                <ColouredBar colour={colour.rgb} onSelect={()=>showColourPicker(colour, index, ACTION_TYPES.UPDATE_SUPPORTCOLOUR)}/>
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