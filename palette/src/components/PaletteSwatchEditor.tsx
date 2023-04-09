import { Colour, Palette } from "../types/colours"
import { useState, useEffect, useRef } from 'react'
import ColouredBar from "./ColouredBar";
import {ACTION_TYPES, PaletteState} from "../hooks/usePaletteEditorReducer"

type Props = {
    state:PaletteState
    updatePaletteColour: (colour:Colour, index:number, type:ACTION_TYPES) => void

}


export default function PaletteSwatchEditor(props:Props) {
    const {state, updatePaletteColour} = props
    const [palette, setPalette] = useState<Palette>(state.palette)


    useEffect(()=>{
        setPalette(state.palette)
    }, [state.palette])



    return (
        <div className='w-full grid grid-rows-2 gap-0 h-full flex-wrap'>
            <div className='w-full grid grid-cols-2'>
                <div className='w-full items-center justify-center'>
                    <div className='flex flex-col w-full h-full items-center' 
                        style={{
                            border:(state.role === ACTION_TYPES.UPDATE_MAINCOLOUR) ? 
                                '2px solid white':''
                        }}
                    >
                        <ColouredBar 
                            hover={true} 
                            colour={palette.mainColour.rgb} 
                            onSelect={()=>updatePaletteColour(palette.mainColour, 0, ACTION_TYPES.UPDATE_MAINCOLOUR)}
                        />
                    </div>
                </div>
                <div className='w-full flex items-center justify-center'>
                    {
                        palette?.accentColours.map((colour, index)=>{
                            return (
                                <div 
                                    key={`accent-${index}`} 
                                    className='flex flex-col w-full h-full items-center' 
                                    style={{
                                        border:(state.index===index && state.role === ACTION_TYPES.UPDATE_ACCENTCOLOUR)?
                                            '2px solid white':''
                                    }
                                }>
                                    <ColouredBar 
                                        hover={true} 
                                        colour={colour.rgb} 
                                        onSelect={()=>updatePaletteColour(colour, index, ACTION_TYPES.UPDATE_ACCENTCOLOUR)}
                                    />
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
                            <div 
                                key={`accent-${index}`} 
                                className='flex flex-col w-full h-full items-center' 
                                style={{
                                    border:(state.index===index && state.role === ACTION_TYPES.UPDATE_SUPPORTCOLOUR)?
                                        '2px solid white':''
                                }}
                            >
                                <ColouredBar 
                                    hover={true} 
                                    colour={colour.rgb} 
                                    onSelect={()=>updatePaletteColour(colour, index, ACTION_TYPES.UPDATE_SUPPORTCOLOUR)}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}