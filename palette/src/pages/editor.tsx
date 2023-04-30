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
import { useAuthContext } from "../hooks/useAuthContext"
import AlertBox from "../components/common/AlertBox"
import CustomComplementarySchemeGenerator from "../model/CustomComplementarySchemeGenerator"
import EdtiorSection from "../sections/EditorSection"
import useEditorAlertReducer from "../hooks/useEditorAlertReducer"
import useColourControlsReducer, { COLOUR_CONTROLS_ACTION_TYPE, SLIDER_MAX_VALUE } from "../hooks/useColourControlsReducer"
import useGetPaletteById from "../hooks/useGetPaletteById"
import { createColour } from "../model/common/utils"



type Harmonies = {
    [key:string]:{
        id:number, 
        label:string, 
        generator:PaletteGenerator,
        isCustom:boolean,
        numVertex?:number
    },
}

const colourHarmonies:Harmonies = {
    complementary: {id:1, label:'Complementary', generator:new ComplementarySchemeGenerator(new ColourConverter()), isCustom:false},
    splitComplementary: {id:2, label:'Split Complementary', generator:new SplitComplementarySchemeGenerator(new ColourConverter()), isCustom:false},
    triadic: {id:3, label:'Triadic', generator:new TriadicSchemeGenerator(new ColourConverter()), isCustom:false},
    analogous: {id:4, label:'Analogous', generator:new AnalogousSchemeGenerator(new ColourConverter()), isCustom:false},
    tetratic: {id:5, label:'Tetratic', generator:new TetraticSchemeGenerator(new ColourConverter()), isCustom:false},
    square: {id:6, label:'Square', generator:new SquareSchemeGenerator(new ColourConverter()), isCustom:false},
    custom2: {id:7, label:'Custom(2)', generator:new CustomComplementarySchemeGenerator(new ColourConverter()), isCustom:true, numVertex:2},
    custom3: {id:8, label:'Custom(3)', generator:new CustomTriadicSchemeGenerator(new ColourConverter()), isCustom:true, numVertex:3},
    custom4: {id:9, label:'Custom(4)', generator:new CustomTetraticSchemeGenerator(new ColourConverter()), isCustom:true, numVertex:4},
}

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
    role:ACTION_TYPES.INITIALISE,
    index:0,
}

type Props = {
    updatePalette?:Function
}
export default function Editor(props:Props) {
    const [pageLoaded, setPageLoaded] = useState<boolean>(false)
    const [inputColours, setInputColours] = useState<HEX[]>(['ff0000'])
    const [selectedHarmony, setSelectedHarmony] = useState<string>('')
    const [generator, setGenerator] = useState<PaletteGenerator|undefined>(colourHarmonies.complementary.generator)
    const [paletteName, setPaletteName] = useState<string>('')
    
    const [colourControlsState, colourControlsDispatch] = useColourControlsReducer()
    const [paletteEditorState, paletteEditorDispatch] = usePaletteEditorReducer(initialState)
    const [alertState, alertDispatch] = useEditorAlertReducer({message:'', alertType:'none', visible:false})
    
    const navigate = useNavigate()
    const location = useLocation()
    const {user, finishedLoading} = useAuthContext() 
    const params = useParams()
    const [savedPalette, setSavedPalette] = useGetPaletteById({paletteId:params.id})

    async function loadPage() {
        if (finishedLoading && savedPalette.finishedLoading && savedPalette.palette && savedPalette.palette.length > 0) {
            let payload = {
                palette:savedPalette.palette[0].palette,
                colour:savedPalette.palette[0].palette.mainColour,
                role:ACTION_TYPES.UPDATE_MAINCOLOUR,
                index:0
            }
            setPaletteName(savedPalette.palette[0].name)
            paletteEditorDispatch({type:ACTION_TYPES.INITIALISE, payload:payload})
            initHarmony(payload.palette)
        }
        else {
            //TODO: Handle no palette case
            console.log('no palette')
        }            
    }

    //suggest rename or refactor this function
    function initHarmony(palette:Palette) {
        const numVertex:number = palette.colourVerticies.length
        const harmony:string[] = Object.keys(colourHarmonies).filter(key=>{
            if (colourHarmonies[key].numVertex) {
                return (colourHarmonies[key].numVertex === numVertex)
            }
        })
        setSelectedHarmony(harmony[0])
        if (harmony[0] in colourHarmonies) {
            let gen = colourHarmonies[harmony[0] as keyof Harmonies].generator
            setGenerator(gen)
            initialiseCustomColours(harmony[0],  palette)           
        }
    }

    //handle page redirection
    useEffect(()=>{
        if (savedPalette.redirect) {
            setSavedPalette({...savedPalette, redirect:false})
            navigate('/editor')
        }
        if (finishedLoading && savedPalette.finishedLoading) {
            loadPage()
            setPageLoaded(true)
        }
    }, [finishedLoading, savedPalette.finishedLoading, savedPalette.redirect])


    //update palette and harmony if location.state is set
    useEffect(()=>{
        //assumes location.state is a Palette object. need to validate that
        if (location.state && location.state.mainColour.rgb) {
            console.log(JSON.stringify(location.state))
            let payload = {
                palette:location.state,
                colour:location.state.mainColour,
                role:ACTION_TYPES.INITIALISE,
                index:0
            }
            paletteEditorDispatch({type:ACTION_TYPES.INITIALISE, payload:payload})
            initHarmony(payload.palette)            
        }
    }, [location])
    

    //synchornise the colours of the user input controls with the palette
    useEffect(()=>{
        if (paletteEditorState.colour && 
                paletteEditorState.role === ACTION_TYPES.UPDATE_MAINCOLOUR) {
            let currColours = [...inputColours]
            currColours[0] = paletteEditorState.colour.rgb
            setInputColours(currColours)
        }
        else if (paletteEditorState.colour && 
                    paletteEditorState.role === ACTION_TYPES.UPDATE_ACCENTCOLOUR && 
                    colourHarmonies[selectedHarmony]?.isCustom) {
            let currColours = [inputColours[0]]
            paletteEditorState.palette.accentColours.forEach(colour=>{
                currColours.push(colour.rgb)
            })
            setInputColours(currColours)
        }
    }, [paletteEditorState.colour, paletteEditorState.role])

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

    //change handle position if the window size changes
    useEffect(()=>{
        if (paletteEditorState && paletteEditorState.colour) initHandlePosition(paletteEditorState.colour)
    }, [colourControlsState.wheelWidth, colourControlsState.handleWidth])

    function generatePalettes(targetGenerator:PaletteGenerator|undefined=generator) {
        
        if (targetGenerator) {
            let result:Result<Colour[][], string> = targetGenerator.generateColourVerticies(inputColours[0], inputColours)
            if (result.isSuccess()) {
                let verticies:Colour[][] = result.value
                let paletteResult:Result<Palette,string> = targetGenerator.generatePalette(inputColours[0], verticies[0])
                if (paletteResult.isSuccess()) {
                    let newPalette:Palette = paletteResult.value
                    paletteEditorDispatch({type:ACTION_TYPES.SET_PALETTE, payload:{palette:newPalette}})
                    paletteEditorDispatch({type:ACTION_TYPES.INITIALISE_MAINCOLOUR, payload:{colour:newPalette.mainColour}})
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

    function makeSelection(targetHarmony:string) {
        setSelectedHarmony(targetHarmony)
        if (targetHarmony in colourHarmonies) {
            const harmony = colourHarmonies[targetHarmony as keyof Harmonies] 
            setGenerator(harmony.generator)
            if (harmony.isCustom && harmony.numVertex !== undefined) {
                const newInputColours:string[] = initialiseCustomColours(targetHarmony, paletteEditorState.palette)       
                resetPalette(newInputColours, paletteEditorState.palette)
            }
            else {
                setInputColours([inputColours[0]])
            }    
        }
    }

    function initialiseCustomColours(targetHarmony:string, palette:Palette):string[] {
        const harmony = colourHarmonies[targetHarmony as keyof Harmonies] 
        if (harmony.isCustom && harmony.numVertex !== undefined) {
            //the number of inputColours to initialise depends on the difference between 
            //the number of accent inputColours and the number of verticies of the chosen custom colour scheme
            const numVertex = harmony.numVertex as number
            const remainingVerticies = numVertex - palette.accentColours.length - 1 //number of verticies is equal to the number of accent inputColours + the main colour 
            let newInputColours = Array.prototype.concat([palette.mainColour.rgb], palette.accentColours.map(colour=>colour.rgb))
            if (remainingVerticies === 0) {
                //do nothing
            }
            if (remainingVerticies < 0) {
                //we have more inputColours than we need, pop off
                for (let i = 0; i < Math.abs(remainingVerticies); i++) {
                    newInputColours.pop()
                }
            }
            else if (remainingVerticies > 0) {
                //we dont have enough inputColours, add gray
                for (let i = newInputColours.length; i < numVertex; i++) {
                    newInputColours.push('7F7F7F')
                }
            }
            setInputColours(newInputColours)
            return newInputColours
        }
        else {
            //if we have more inputColours than required and we're not choosing a custom scheme, set the number to 1 by default
            setInputColours([inputColours[0]])
            return [inputColours[0]]
        }
    }

    //synchronise palette with new inputColours
    function resetPalette(newInputColours:string[], palette:Palette) {
        const newVerticies:Colour[] = newInputColours.map(hexColour=>createColour(hexColour))
        const newAccentColours:Colour[] = newVerticies.filter(vertex=>vertex.rgb !== palette.mainColour.rgb)
        const newPalette:Palette = {...palette}
        newPalette.accentColours = newAccentColours
        newPalette.colourVerticies = newVerticies
        paletteEditorDispatch({type:ACTION_TYPES.SET_PALETTE, payload:{palette:newPalette}})
        paletteEditorDispatch({type:ACTION_TYPES.INITIALISE_MAINCOLOUR, payload:{colour:newPalette.mainColour}})
    }


    return (
        <ContentBox finishedLoading={pageLoaded}>
            <section className='w-full py-16 lg:px-24'>
                <div className='w-full flex flex-col items-center justify-center gap-4'>
                    <ColourPickerSection colours={inputColours} setColours={setInputColours}/>
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
                paletteEditorState={paletteEditorState}
                paletteEditorDispatch={paletteEditorDispatch}
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