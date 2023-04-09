import ContentBox from "../components/common/ContentBox"
import { useState, useEffect } from 'react'
import { Colour, HEX, HSV, Palette } from "../types/colours"
import ComplementarySchemeGenerator from "../model/ComplementarySchemeGenerator"
import ColourConverter from "../model/colourConverter"
import ColourPickerSection from "../sections/ColourPickerSection"
import SplitComplementarySchemeGenerator from "../model/SplitComplementarySchemeGenerator"
import TriadicSchemeGenerator from "../model/TriadicSchemeGenerator"
import AnalogousSchemeGenerator from "../model/AnalogousSchemeGenerator"
import TetraticSchemeGenerator from "../model/TetraticSchemeGenerator"
import SquareSchemeGenerator from "../model/SquareSchemeGenerator"
import PaletteGenerator from "../model/paletteGenerator"
import {  rgb2cartesian } from "../model/common/utils"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CustomTriadicSchemeGenerator from "../model/CustomTriadicSchemeGenerator"
import CustomTetraticSchemeGenerator from "../model/CustomTetraticSchemeGenerator"
import { ACTION_TYPES, usePaletteEditorReducer } from "../hooks/usePaletteEditorReducer"
import HarmonySelector from "../components/HarmonySelector"
import { Result } from "../model/common/error"
import LibraryService from "../service/library-service"
import { SavedPalette } from "../types/library"
import { useAuthContext } from "../hooks/useAuthContext"
import AlertBox from "../components/common/AlertBox"
import CustomComplementarySchemeGenerator from "../model/CustomComplementarySchemeGenerator"
import EdtiorSection from "../sections/EditorSection"
import useEditorAlertReducer from "../hooks/useEditorAlertReducer"
import useColourControlsReducer, { COLOUR_CONTROLS_ACTION_TYPE, SLIDER_MAX_VALUE } from "../hooks/useColourControlsReducer"



type Harmonies = {
    [key:string]:{
        id:number, 
        label:string, 
        generator:PaletteGenerator,
        isCustom:boolean
    },
}

const colourHarmonies:Harmonies = {
    complementary: {id:1, label:'Complementary', generator:new ComplementarySchemeGenerator(new ColourConverter()), isCustom:false},
    splitComplementary: {id:2, label:'Split Complementary', generator:new SplitComplementarySchemeGenerator(new ColourConverter()), isCustom:false},
    triadic: {id:3, label:'Triadic', generator:new TriadicSchemeGenerator(new ColourConverter()), isCustom:false},
    analogous: {id:4, label:'Analogous', generator:new AnalogousSchemeGenerator(new ColourConverter()), isCustom:false},
    tetratic: {id:5, label:'Tetratic', generator:new TetraticSchemeGenerator(new ColourConverter()), isCustom:false},
    square: {id:6, label:'Square', generator:new SquareSchemeGenerator(new ColourConverter()), isCustom:false},
    custom2: {id:7, label:'Custom(2)', generator:new CustomComplementarySchemeGenerator(new ColourConverter()), isCustom:true},
    custom3: {id:8, label:'Custom(3)', generator:new CustomTriadicSchemeGenerator(new ColourConverter()), isCustom:true},
    custom4: {id:9, label:'Custom(4)', generator:new CustomTetraticSchemeGenerator(new ColourConverter()), isCustom:true},
}

// const initWheelWidth = 400
// const initHandleWidth = 20
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
    index:0,
}

// const MAX_VALUE:number = 100
// const initialColourControlsState = {
//     wheelWidth:initWheelWidth,
//     handleWidth:initHandleWidth,
//     handlePosition:{x:initWheelWidth/2 - initHandleWidth/2, y:initWheelWidth/2 - initHandleWidth/2},
//     sliderValue:MAX_VALUE
// }
type Props = {
    updatePalette?:Function
}
export default function Editor(props:Props) {
    const [colours, setColours] = useState<HEX[]>(['ff0000'])
    const [selectedHarmony, setSelectedHarmony] = useState<string>('')
    const [generator, setGenerator] = useState<PaletteGenerator|undefined>(colourHarmonies.complementary.generator)
    const [paletteName, setPaletteName] = useState<string>('')
    
    const [colourControlsState, colourControlsDispatch] = useColourControlsReducer()
    const [state, dispatch] = usePaletteEditorReducer(initialState)
    const [alertState, alertDispatch] = useEditorAlertReducer({message:'', alertType:'none', visible:false})
    
    const navigate = useNavigate()
    const location = useLocation()
    const {user} = useAuthContext() 
    const params = useParams()


    useEffect(()=>{
        if (params.id && user) {
            //get palette by id
            async function get() {
                try {
                    const savedPalette:SavedPalette[] = await LibraryService.getPaletteById(params.id as string)
                    console.log(savedPalette)
                    if (savedPalette && savedPalette.length > 0) {
                        let payload = {
                            palette:savedPalette[0].palette,
                            colour:savedPalette[0].palette.mainColour,
                            role:ACTION_TYPES.UPDATE_MAINCOLOUR,
                            index:0
                        }
                        setPaletteName(savedPalette[0].name)
                        dispatch({type:ACTION_TYPES.INITIALISE, payload:payload})
                    }
                    else {
                        //no 
                        console.log('no palette')
                    }
                }
                catch (e) {
                    console.error(e)
                }
            }
            get()
            console.log(params)
        }
        else if (params.id) {
            navigate('/editor') //to fix. Should wait for user to login before determining whether to redirect or not
        }
        else {
            console.log('no params or userId')
        }
    },[params, user])

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
        if (state.colour && state.role === ACTION_TYPES.UPDATE_MAINCOLOUR) {
            let currColours = [...colours]
            currColours[0] = state.colour.rgb
            setColours(currColours)
        }
        else if (state.colour && state.role === ACTION_TYPES.UPDATE_ACCENTCOLOUR && 
                    colourHarmonies[selectedHarmony as keyof Harmonies]?.isCustom) {
            let currColours = [colours[0]]
            state.palette.accentColours.forEach(colour=>{
                currColours.push(colour.rgb)
            })
            setColours(currColours)
        }
    }, [state.colour, selectedHarmony, state.role])

    function initHandlePosition(colour:Colour) {
        let result:Result<HSV, string> = cc.rgb2hsv(colour.rgb)
        let newValue:number = 0 
        if (result.isSuccess()){
            newValue = result.value.value 
        }
        else {
            ////TODO:throw exception/error
        } 
        colourControlsDispatch({
            type:COLOUR_CONTROLS_ACTION_TYPE.SET_SLIDER_VALUE, 
            payload:{sliderValue:newValue*SLIDER_MAX_VALUE}
        })
        let newPosition = rgb2cartesian(colour.rgb, colourControlsState.wheelWidth/2, colourControlsState.handleWidth/2)
        colourControlsDispatch({
            type:COLOUR_CONTROLS_ACTION_TYPE.SET_HANDLE_POSITION, 
            payload:{handlePosition:newPosition}
        })
    }

    useEffect(()=>{
        if (state && state.colour) initHandlePosition(state.colour)
    }, [colourControlsState.wheelWidth, colourControlsState.handleWidth])

    function generatePalettes(targetGenerator:PaletteGenerator|undefined=generator) {
        
        if (targetGenerator) {
            let result:Result<Colour[][], string> = targetGenerator.generateColourVerticies(colours[0], colours)
            if (result.isSuccess()) {
                let verticies:Colour[][] = result.value
                let paletteResult:Result<Palette,string> = targetGenerator.generatePalette(colours[0], verticies[0])
                if (paletteResult.isSuccess()) {
                    let newPalette:Palette = paletteResult.value
                    dispatch({type:ACTION_TYPES.SET_PALETTE, payload:{palette:newPalette}})
                    dispatch({type:ACTION_TYPES.INITIALISE_MAINCOLOUR, payload:{colour:newPalette.mainColour}})
                    initHandlePosition(newPalette.mainColour)
                    alertDispatch({type:'info', payload:{message:'Palette generated', visibile:true}})
                }
                else {
                    ////TODO:handle error
                    return
                }
            }
            else {
                ////TODO:handle error
                return
            }
        }
    }

    function makeSelection(value:string) {
        setSelectedHarmony(value)
        if (value in colourHarmonies) {
            let gen = colourHarmonies[value as keyof Harmonies].generator
            setGenerator(gen)
            generatePalettes(gen)
            
        }
    }

    useEffect(()=>{
        if (colourHarmonies[selectedHarmony as keyof Harmonies]?.isCustom) {
            let newColours:string[] = [colours[0]]
                state.palette.accentColours.forEach(colour=>{
                    newColours.push(colour.rgb)
            })
            setColours(newColours)
        }
        else {
            setColours([state.palette.mainColour.rgb])
        }
    }, [state.palette.accentColours])

    return (
        <ContentBox>
            <section className='w-full py-16 lg:px-24'>
                <div className='w-full flex flex-col items-center justify-center gap-4'>
                    <ColourPickerSection colours={colours} setColours={setColours}/>
                    <HarmonySelector 
                        value={selectedHarmony} 
                        setValue={makeSelection} 
                        harmonies={colourHarmonies}
                    />
                    <button 
                        className='btn btn-primary w-full' 
                        onClick={()=>generatePalettes(undefined)}
                    >
                        Generate!
                    </button>
                </div>
            </section>
            <EdtiorSection
                state={state}
                dispatch={dispatch}
                paletteName={paletteName}
                setPaletteName={setPaletteName}
                alertState={alertState}
                alertDispatch={alertDispatch}
                colourControlsState={colourControlsState}
                colourControlsDispatch={colourControlsDispatch}
            />
            <AlertBox 
                message={alertState.message} 
                alertType={alertState.alertType} 
                visible={alertState.visible} 
                hide={()=>alertDispatch({type:'hide', payload:{message:alertState.message, visibile:alertState.visible}})}
            />
        </ContentBox>
    )
}