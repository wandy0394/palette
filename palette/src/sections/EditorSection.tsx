import { useAuthContext } from "../hooks/useAuthContext"
import {  useRef, useLayoutEffect, useEffect } from 'react'
import { ACTION_TYPES, PaletteAction, PaletteState } from "../hooks/usePaletteEditorReducer"
import PaletteSwatchEditor from "../components/PaletteSwatchEditor"
import ValueSlider from "../components/ValueSlider"
import ColourWheelPicker from "../components/ColourWheelPicker"
import { Colour, HSV } from "../types/colours"
import {  createColour, rgb2cartesian } from "../model/common/utils"
import LibraryService from "../service/library-service"
import { useParams } from "react-router-dom"
import { AlertAction, AlertState } from "../hooks/useEditorAlertReducer"
import { COLOUR_CONTROLS_ACTION_TYPE, ColourControlsAction, ColourControlsState, SLIDER_MAX_VALUE } from "../hooks/useColourControlsReducer"

type Props = {
    paletteEditorState: PaletteState
    paletteEditorDispatch: React.Dispatch<PaletteAction>
    paletteName: string,
    setPaletteName: React.Dispatch<React.SetStateAction<string>>
    alertState: AlertState
    alertDispatch: React.Dispatch<AlertAction>
    colourControlsState:ColourControlsState
    colourControlsDispatch:React.Dispatch<ColourControlsAction>
}

export default function EdtiorSection(props:Props) {
    const {
        paletteEditorState, 
        paletteEditorDispatch, 
        paletteName, 
        setPaletteName, 
        alertState, 
        alertDispatch,
        colourControlsState,
        colourControlsDispatch
    } = props


    const params = useParams()
    const {user} = useAuthContext()
    const wheelRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(()=>{
        if (!wheelRef.current) return
        const resizeObserver = new ResizeObserver(()=>{
            if (wheelRef.current) {
                colourControlsDispatch({
                    type:COLOUR_CONTROLS_ACTION_TYPE.SET_WHEEL_WIDTH, 
                    payload:{wheelWidth:wheelRef.current.clientHeight}
                })
                colourControlsDispatch({
                    type:COLOUR_CONTROLS_ACTION_TYPE.SET_HANDLE_WIDTH, 
                    payload:{handleWidth:wheelRef.current.clientHeight / 20}
                })
            }
        })
        resizeObserver.observe(wheelRef.current)
        return ()=>resizeObserver.disconnect()
    }, [])

    function updateValue(value:number) {
        if (paletteEditorState.colour.hsv) {
            colourControlsDispatch({type:COLOUR_CONTROLS_ACTION_TYPE.SET_SLIDER_VALUE, payload:{sliderValue:value}})
            const newHSV:HSV = {
                hue:paletteEditorState.colour.hsv.hue,
                saturation:paletteEditorState.colour.hsv.saturation,
                value:value / SLIDER_MAX_VALUE
            }
            const newColour:Colour = createColour(newHSV)
            paletteEditorDispatch({type:paletteEditorState.role, payload:{colour:newColour, index:paletteEditorState.index}})
        }
    }

    function updatePaletteColour(colour:Colour, index:number, type:ACTION_TYPES) {
        paletteEditorDispatch({type:type, payload:{colour, index:index}})
        if (colour.hsv) {
            colourControlsDispatch({
                type:COLOUR_CONTROLS_ACTION_TYPE.SET_SLIDER_VALUE, 
                payload:{sliderValue:colour.hsv.value*SLIDER_MAX_VALUE}
            })

        }
        let newPosition = rgb2cartesian(colour.rgb, colourControlsState.wheelWidth/2, colourControlsState.handleWidth/2)
        colourControlsDispatch({
            type:COLOUR_CONTROLS_ACTION_TYPE.SET_HANDLE_POSITION, 
            payload:{handlePosition:newPosition}
        })

    }



    function savePalette() {
        if (paletteEditorState.palette && user) {
            async function save() {
                try {
                    const result = await LibraryService.savePalette(paletteEditorState.palette, paletteName)
                    alertDispatch({type:'success', payload:{message:'Palette saved.', visibile:true}})
                }
                catch (e) {
                    alertDispatch({type:'error', payload:{message:'Could not save palette.', visibile:true}})
                }
            }

            async function update() {
                try {
                    if (params.id) {
                        const result = await LibraryService.updatePalette(paletteEditorState.palette, params.id, paletteName) //TODO: validate params.id
                        alertDispatch({type:'success', payload:{message:'Palette updated.', visibile:true}})
                    }
                }
                catch (e) {
                    alertDispatch({type:'error', payload:{message:'Could not update palette.', visibile:true}})
                }
            }
            if (params.id) {
                update()
            }
            else {
                save()
            }
        }
    }
    return (
        <section className='w-full h-screen flex flex-col items-center justify-start lg:px-24'>
            {
               (user && (paletteEditorState.palette.colourVerticies.length>0)) && 
                    <input 
                        className='w-full rounded text-2xl py-2 pl-4' 
                        placeholder="Palette name..." 
                        value={paletteName} 
                        onChange={(e)=>setPaletteName(e.target.value)}
                    />
            }
            <div className='w-full py-8'>
                
                <div className={`${(paletteEditorState.palette.colourVerticies.length>0)?'grid':'hidden'}  grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center justify-center gap-8 justify-items-center`}>
                    
                    <PaletteSwatchEditor 
                        state={paletteEditorState}
                        updatePaletteColour={updatePaletteColour}
                    />
                    
                    <div className='h-full w-full flex flex-col items-center justify-center gap-8 '>
                        <ValueSlider value={colourControlsState.sliderValue} updateValue={(value)=>updateValue(value)}/>
                        <ColourWheelPicker 
                            ref={wheelRef}
                            colourValue={colourControlsState.sliderValue} 
                            palette = {paletteEditorState.palette}
                            chosenColour={paletteEditorState.colour}
                            setChosenColour = {(colour:Colour)=>paletteEditorDispatch({type:paletteEditorState.role, payload:{colour:colour, index:paletteEditorState.index}})}
                            wheelWidth={colourControlsState.wheelWidth}
                            handleWidth={colourControlsState.handleWidth}
                            handlePosition={colourControlsState.handlePosition}
                            setHandlePosition={
                                (handlePosition)=>colourControlsDispatch({
                                    type:COLOUR_CONTROLS_ACTION_TYPE.SET_HANDLE_POSITION, 
                                    payload:{
                                        handlePosition:handlePosition
                                    }
                                })
                            }
                            />
                    </div>
                </div>
                
                {
                    (user && (paletteEditorState.palette.colourVerticies.length>0)) &&
                        <button 
                            className='btn btn-secondary w-full mt-8' 
                            onClick={()=>savePalette()}
                        >
                            Save
                        </button>
                }
            </div>
        </section>
    )
}