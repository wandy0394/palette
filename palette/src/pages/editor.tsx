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
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CustomTriadicSchemeGenerator from "../model/CustomTriadicSchemeGenerator"
import CustomTetraticSchemeGenerator from "../model/CustomTetraticSchemeGenerator"
import { ACTION_TYPES, useChosenColour } from "../hooks/useChosenColour"
import HarmonySelector from "../components/HarmonySelector"
import { Result } from "../model/common/error"
import LibraryService from "../service/library-service"
import { SavedPalette } from "../types/library"
import { useAuthContext } from "../hooks/useAuthContext"
import EditorAlertBox from "../components/EditorAlertBox"
import AlertBox, { AlertType } from "../components/common/AlertBox"
import CustomComplementarySchemeGenerator from "../model/CustomComplementarySchemeGenerator"



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
type Props = {
    updatePalette?:Function
}
export default function Editor(props:Props) {
    const params = useParams()
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
    const [paletteName, setPaletteName] = useState<string>('')
    const navigate = useNavigate()


    const [message, setMessage] = useState<string>('')
    const [alertType, setAlertType] = useState<AlertType>('none')
    const [visible, setVisible] = useState<boolean>(false)

    const {user} = useAuthContext() 

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
        if (params.id) {
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
            if (user) {   
                get()
            }
            else {
                //user has passed a param to the url but there are not palette ids associated with their user id. Redirect them
                navigate('/editor')
            }
            ////TODO:check that logged in user has access to this id
            //if not, throw error
            console.log(params)
        }
        else {
            console.log('no params or userId')
        }
    },[params])
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
        if (state.colour && state.role === ACTION_TYPES.UPDATE_MAINCOLOUR) {
            let currColours = [...colours]
            currColours[0] = state.colour.rgb
            setColours(currColours)
        }
        else if (state.colour && state.role === ACTION_TYPES.UPDATE_ACCENTCOLOUR && colourHarmonies[selectedHarmony as keyof Harmonies]?.isCustom) {
            let currColours = [colours[0]]
            state.palette.accentColours.forEach(colour=>{
                currColours.push(colour.rgb)
            })
            setColours(currColours)
        }
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
            ////TODO:throw exception/error
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
        setHandlePostion(newPosition)
    }


    function generatePalettes() {
        if (generator) {
            let result:Result<Colour[][], string> = generator.generateColourVerticies(colours[0], colours)
            if (result.isSuccess()) {
                let verticies:Colour[][] = result.value
                let paletteResult:Result<Palette,string> = generator.generatePalette(colours[0], verticies[0])
                if (paletteResult.isSuccess()) {
                    let newPalette:Palette = paletteResult.value
                    dispatch({type:ACTION_TYPES.SET_PALETTE, payload:{palette:newPalette}})
                    initChosenColour(newPalette.mainColour)
                    initHandlePosition(newPalette.mainColour)
                    setMessage('Palette generated.')
                    setAlertType('info')
                    setVisible(true)
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

    
    function updateValue(value:number) {
        if (state.colour.hsv) {
            setValue(value)
            const newHSV:HSV = {
                hue:state.colour.hsv.hue,
                saturation:state.colour.hsv.saturation,
                value:value / MAX_VALUE
            }
            const newColour:Colour = createColour(newHSV)
            dispatch({type:state.role, payload:{colour:newColour, index:state.index}})
        }
    }
    


    function makeSelection(value:string) {
        setSelectedHarmony(value)
        if (value in colourHarmonies) {
            setGenerator(colourHarmonies[value as keyof Harmonies].generator)
        }
    }

    useEffect(()=>{
        generatePalettes()

    }, [generator])

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

    function savePalette() {
        //TODO:check if user logged in, otherwise, prompt them to sign up
        if (state.palette) {
            async function save() {
                try {
                    const result = await LibraryService.savePalette(state.palette, paletteName)
                    setMessage('Palette saved.')
                    setAlertType('success')
                    setVisible(true)

                }
                catch (e) {
                    setMessage('Could not save palette')
                    setAlertType('error')
                    setVisible(true)

                }
            }

            async function update() {
                try {
                    const result = await LibraryService.updatePalette(state.palette, parseInt(params.id as string), paletteName) //TODO: validate params.id
                    setMessage('Palette updated.')
                    setAlertType('success')
                    setVisible(true)

                }
                catch (e) {
                    setMessage('Could not update palette')
                    setAlertType('error')
                    setVisible(true)
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
        <ContentBox>
            <section className='w-full py-16 lg:px-24'>
                <div className='w-full flex flex-col items-center justify-center gap-4'>
                    <ColourPickerSection colours={colours} setColours={setColours}/>
                    <HarmonySelector value={selectedHarmony} setValue={makeSelection} harmonies={colourHarmonies}/>
                    <button className='btn btn-primary w-full' onClick={generatePalettes}>Generate!</button>
                </div>
            </section>
            <section className='w-full h-screen flex flex-col items-center justify-start lg:px-24'>
                <input className='w-full rounded text-2xl py-2 pl-4' placeholder="Palette name..." value={paletteName} onChange={(e)=>setPaletteName(e.target.value)}></input>
                <div className='w-full py-8'>
                    
                    <div className={`${(state.palette.colourVerticies.length>0)?'grid':'hidden'}  grid-rows-2 md:grid-rows-1 md:grid-cols-2 items-center justify-center gap-8 justify-items-center`}>
                        
                        <PaletteSwatchEditor 
                            state={state}
                            showColourPicker={showColourPicker}
                        />
                        
                        <div className='h-full w-full flex flex-col items-center justify-center gap-8 '>
                            <ValueSlider value={value} updateValue={(value)=>updateValue(value)}/>
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
                        </div>
                    </div>
                    
                    {
                        (user&&(state.palette.colourVerticies.length>0))?<button className='btn btn-secondary w-full mt-8' onClick={()=>savePalette()}>Save</button>:null
                    }
                </div>
                <AlertBox message={message} alertType={alertType} visible={visible} setVisible={setVisible}/>
            </section>

        </ContentBox>
    )
}