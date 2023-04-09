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
import { Result } from "../model/common/error"
import ColourConverter from "../model/colourConverter"
import { AlertAction, AlertState } from "../hooks/useEditorAlertReducer"
import { COLOUR_CONTROLS_ACTION_TYPE, ColourControlsAction, ColourControlsState, SLIDER_MAX_VALUE } from "../hooks/useColourControlsReducer"

type Props = {
    state: PaletteState
    dispatch: React.Dispatch<PaletteAction>
    paletteName: string,
    setPaletteName: React.Dispatch<React.SetStateAction<string>>
    alertState: AlertState
    alertDispatch: React.Dispatch<AlertAction>
    colourControlsState:ColourControlsState
    colourControlsDispatch:React.Dispatch<ColourControlsAction>
}

export default function EdtiorSection(props:Props) {
    const {
        state, 
        dispatch, 
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
        if (state.colour.hsv) {
            colourControlsDispatch({type:COLOUR_CONTROLS_ACTION_TYPE.SET_SLIDER_VALUE, payload:{sliderValue:value}})
            const newHSV:HSV = {
                hue:state.colour.hsv.hue,
                saturation:state.colour.hsv.saturation,
                value:value / SLIDER_MAX_VALUE
            }
            const newColour:Colour = createColour(newHSV)
            dispatch({type:state.role, payload:{colour:newColour, index:state.index}})
        }
    }

    function updatePaletteColour(colour:Colour, index:number, type:ACTION_TYPES) {
        dispatch({type:type, payload:{colour, index:index}})
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
        if (state.palette && user) {
            async function save() {
                try {
                    const result = await LibraryService.savePalette(state.palette, paletteName)
                    alertDispatch({type:'success', payload:{message:'Palette saved.', visibile:true}})
                }
                catch (e) {
                    alertDispatch({type:'error', payload:{message:'Could not save palette.', visibile:true}})
                }
            }

            async function update() {
                try {
                    const result = await LibraryService.updatePalette(state.palette, parseInt(params.id as string), paletteName) //TODO: validate params.id
                    alertDispatch({type:'success', payload:{message:'Palette updated.', visibile:true}})
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
            <input 
                className='w-full rounded text-2xl py-2 pl-4' 
                placeholder="Palette name..." 
                value={paletteName} 
                onChange={(e)=>setPaletteName(e.target.value)}
            />
            <div className='w-full py-8'>
                
                <div className={`${(state.palette.colourVerticies.length>0)?'grid':'hidden'}  grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center justify-center gap-8 justify-items-center`}>
                    
                    <PaletteSwatchEditor 
                        state={state}
                        updatePaletteColour={updatePaletteColour}
                    />
                    
                    <div className='h-full w-full flex flex-col items-center justify-center gap-8 '>
                        <ValueSlider value={colourControlsState.sliderValue} updateValue={(value)=>updateValue(value)}/>
                        <ColourWheelPicker 
                            ref={wheelRef}
                            colourValue={colourControlsState.sliderValue} 
                            palette = {state.palette}
                            chosenColour={state.colour}
                            setChosenColour = {(colour:Colour)=>dispatch({type:state.role, payload:{colour:colour, index:state.index}})}
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
                    (user && (state.palette.colourVerticies.length>0)) &&
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