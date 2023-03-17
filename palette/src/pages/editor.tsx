import ContentBox from "../components/common/ContentBox"
import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Colour, HEX, HSV, Palette } from "../types/colours"
import ValueSlider from "../components/ValueSlider"
import ComplementarySchemeGenerator from "../model/ComplementarySchemeGenerator"
import ColourConverter from "../model/colourConverter"
import ColourPickerSection from "../sections/ColourPickerSection"
import SplitComplementarySchemeGenerator from "../model/SplitComplementarySchemeGenerator"
import TriadicSchemeGenerator from "../model/TriadicSchemeGenerator"
import AnalogousSchemeGenerator from "../model/AnalogousSchemeGenerator"
import TetraticSchemeGenerator from "../model/TetraticSchemeGenerator"
import SquareSchemeGenerator from "../model/SquareSchemeGenerator"
import PaletteGenerator from "../model/paletteGenerator"
import PaletteSwatchEditor from "../components/PaletteSwatchEditor"
import ColourWheelPicker from "../components/ColourWheelPicker"
import { Point } from "../types/cartesian"
import {  createColour, rgb2cartesian } from "../model/common/utils"
import { useLocation } from "react-router-dom"
import CustomTriadicSchemeGenerator from "../model/CustomTriadicSchemeGenerator"
import CustomTetraticSchemeGenerator from "../model/CustomTetraticSchemeGenerator"
import { ACTION_TYPES, useChosenColour } from "../hooks/useChosenColour"
import HarmonySelector from "../components/HarmonySelector"
import { width } from "@mui/system"
import { Result } from "../model/common/error"



type Harmonies = {
    [key:string]:{id:number, label:string, generator:PaletteGenerator},
}

const colourHarmonies:Harmonies = {
    complementary: {id:1, label:'Complementary', generator:new ComplementarySchemeGenerator(new ColourConverter())},
    splitComplementary: {id:2, label:'Split Complementary', generator:new SplitComplementarySchemeGenerator(new ColourConverter())},
    triadic: {id:3, label:'Triadic', generator:new TriadicSchemeGenerator(new ColourConverter())},
    analogous: {id:4, label:'Analogous', generator:new AnalogousSchemeGenerator(new ColourConverter())},
    tetratic: {id:5, label:'Tetratic', generator:new TetraticSchemeGenerator(new ColourConverter())},
    square: {id:6, label:'Square', generator:new SquareSchemeGenerator(new ColourConverter())},
    custom3: {id:7, label:'Custom(3)', generator:new CustomTriadicSchemeGenerator(new ColourConverter())},
    custom4: {id:8, label:'Custom(4)', generator:new CustomTetraticSchemeGenerator(new ColourConverter())},
    
}

const initWheelWidth = 400
const initHandleWidth = 20
const cc = new ColourConverter()
const emptyPalette:Palette = {
    mainColour:{
        rgb:'000000',
        hsv:{
            hue:0,
            saturation:0,
            value:0
        }
    },
    colourVerticies:[],
    accentColours:[],
    supportColours:[]
}

const initialState = {
    palette:emptyPalette,
    colour:{
        rgb:'ff0000',
        hsv:{
            hue:0,
            saturation:1,
            value:1
        }
    },
    role:ACTION_TYPES.UPDATE_MAINCOLOUR,
    index:0
}
const MAX_VALUE:number = 100
export default function Editor() {
    const [value, setValue] = useState<number>(MAX_VALUE)
    const [colours, setColours] = useState<HEX[]>(['ff0000'])
    const [selectedHarmony, setSelectedHarmony] = useState<string>('')
    const [generator, setGenerator] = useState<PaletteGenerator|undefined>(colourHarmonies.complementary.generator)
    const [handlePosition, setHandlePostion] = useState<Point>({x:initWheelWidth/2 - initHandleWidth/2, y:initWheelWidth/2 - initHandleWidth/2})
    const [position, setPosition] = useState<Point>({x:0, y:0})
    const location = useLocation()

    const [wheelWidth, setWheelWidth] = useState<number>(initWheelWidth)
    const [handleWidth, setHandleWidth] = useState<number>(initHandleWidth)
    const wheelRef = useRef<HTMLDivElement>(null)
    const [state, dispatch] = useChosenColour(initialState)

    useLayoutEffect(()=>{
        if (!wheelRef.current) return
        const resizeObserver = new ResizeObserver(()=>{
            if (wheelRef.current) {
                setWheelWidth(wheelRef.current.clientHeight)
                setHandleWidth(wheelRef.current.clientHeight / 20)
            }
        })
        resizeObserver.observe(wheelRef.current)
        return ()=>resizeObserver.disconnect()
    }, [])

    useEffect(()=>{
        if (state && state.colour) initHandlePosition(state.colour)
    }, [wheelWidth, handleWidth])

    useEffect(()=>{
        if (location.state && location.state.mainColour.rgb) {
            console.log(JSON.stringify(location.state))
            let payload = {
                palette:location.state,
                colour:location.state.mainColour,
                role:ACTION_TYPES.UPDATE_MAINCOLOUR,
                index:0
            }
            dispatch({type:ACTION_TYPES.INITIALISE, payload:payload})
        }
    }, [location])

    useEffect(()=>{
        if (state.colour && state.role === ACTION_TYPES.UPDATE_MAINCOLOUR) setColours([state.colour.rgb])
    }, [state.colour])

    function initChosenColour(colour:Colour) {
        dispatch({type:ACTION_TYPES.INITIALISE_MAINCOLOUR, payload:{colour:colour}})

    }
    function initHandlePosition(colour:Colour) {
        let result:Result<HSV, string> = cc.rgb2hsv(colour.rgb)
        let newValue:number = 0 
        if (result.isSuccess()){
            newValue = result.value.value 
        }
        else {
            //throw exception/error
        } 
        setValue(newValue*MAX_VALUE)
        let newPosition = rgb2cartesian(colour.rgb, wheelWidth/2, handleWidth/2)
        setHandlePostion(newPosition)
    }


    function showColourPicker(colour:Colour, index:number, type:ACTION_TYPES) {
        dispatch({type:type, payload:{colour, index:index}})
        if (colour.hsv) {
            setValue(colour.hsv.value*MAX_VALUE)
        }
        let newPosition = rgb2cartesian(colour.rgb, wheelWidth/2, handleWidth/2)
        console.log(colour.rgb)
        setHandlePostion(newPosition)
    }


    function generatePalettes() {
        if (generator) {
            let result:Result<Colour[][], string> = generator.generateColourVerticies(colours[0], state.palette.colourVerticies)
            if (result.isSuccess()) {
                let verticies:Colour[][] = result.value
                let paletteResult:Result<Palette,string> = generator.generatePalette(colours[0], verticies[0])
                if (paletteResult.isSuccess()) {
                    let newPalette:Palette = paletteResult.value
                    dispatch({type:ACTION_TYPES.SET_PALETTE, payload:{palette:newPalette}})
                    initChosenColour(newPalette.mainColour)
                    initHandlePosition(newPalette.mainColour)
                }
                else {
                    //handle error
                    return
                }
            }
            else {
                //handle error
                return
            }
        }
    }

    
    function updateValue(value:number) {
        if (state.colour.hsv) {
            setValue(value)
            const newHSV:HSV = {
                hue:state.colour.hsv.hue,
                saturation:state.colour.hsv.saturation,
                value:value / MAX_VALUE
            }
            const newColour:Colour = createColour(newHSV)
            console.log(state.role)
            dispatch({type:state.role, payload:{colour:newColour, index:state.index}})
        }
    }
    


    function makeSelection(value:string) {
        setSelectedHarmony(value)
        if (value in colourHarmonies) {
            setGenerator(colourHarmonies[value as keyof Harmonies].generator)
        }
    }

    return (
        <ContentBox>
            <section className='bg-neutral-900 w-full py-16 px-24'>
                <div className='w-full px-24 flex gap-16 items-center'>
                    <div className='w-1/2 flex flex-col items-center justify-center gap-16'>
                        <ColourPickerSection colours={colours} setColours={setColours}/>
                    </div>
                    <div className='w-1/2 flex flex-col items-center justify-center gap-16'>
                        <HarmonySelector value={selectedHarmony} setValue={makeSelection} harmonies={colourHarmonies}/>
                        <button className='btn btn-primary w-full' onClick={generatePalettes}>Generate!</button>
                    </div>
                </div>
            </section>
            <section className='bg-neutral-800 w-full py-16 px-24'>
                {
                    <div className={`${(state.palette.colourVerticies.length>0)?'grid':'hidden'} grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center justify-center gap-4 justify-items-center pb-8`}>
                        {
                            <PaletteSwatchEditor 
                                state={state}
                                showColourPicker={showColourPicker}
                            />
                        }
                        <div className='h-full w-full flex items-center justify-center gap-8'>
                            <ColourWheelPicker 
                                ref={wheelRef}
                                colourValue={value} 
                                palette = {state.palette}
                                chosenColour={state.colour}
                                setChosenColour = {(colour:Colour)=>dispatch({type:state.role, payload:{colour:colour, index:state.index}})}
                                wheelWidth={wheelWidth}
                                handleWidth={handleWidth}
                                handlePosition={handlePosition}
                                position={position}
                                setPosition={setPosition}
                            />
                            <ValueSlider value={value} updateValue={(value)=>updateValue(value)}/>
                        </div>
                    </div>
                }
            </section>

        </ContentBox>
    )
}