import ContentBox from "../components/common/ContentBox"
import { useState, useEffect } from 'react'
import { Colour, ColourRole, HEX, HSV, Palette, PaletteKey, Scheme } from "../types/colours"
import PaletteSwatch from "../components/PaletteSwatch"
import ColourWheel from "../components/ColourWheel"
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
import { cartesian2hsv, modulo } from "../model/common/utils"
import useSessionStorage from "../hooks/useSessionStorage"
import { useLocation } from "react-router-dom"



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
}

function SchemeSelector(props:{value:any, setValue:Function, harmonies:any}) {
    const {harmonies, value, setValue} = props
    return (
        <select className='select select-primary w-full max-w-xs' value={value} onChange={(e)=>setValue(e.target.value)}>
            <option disabled selected>Choose a colour harmony</option>
            {
                (harmonies !== undefined) &&
                Object.keys(harmonies).map((key)=>{
                    return (
                        <option key={key} id={harmonies[key].id} value={key}>
                            {harmonies[key].label}
                        </option>
                    )
                })
            }
        </select>
    )
}

const wheelWidth = 400
const handleWidth = 20
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


export default function Editor() {
    const [palette, setPalette] = useState<Palette>(emptyPalette)
    const [value, setValue] = useState<number>(100)
    const [colours, setColours] = useState<HEX[]>(['ff0000'])
    const [selectedHarmony, setSelectedHarmony] = useState<string>('')
    const [generator, setGenerator] = useState<PaletteGenerator|undefined>(colourHarmonies.complementary.generator)
    const [chosenColour, setChosenColour] = useState<Colour>({rgb:'ffffff', hsv:{hue:0, saturation:1, value:1}})
    const [chosenColourRole, setChosenColourRole] = useState<ColourRole>('none')
    const [chosenColourIndex, setChosenColourIndex] = useState<number>(0)
    const [handlePosition, setHandlePostion] = useState<Point>({x:wheelWidth/2 - handleWidth/2, y:wheelWidth/2 - handleWidth/2})
    const [position, setPosition] = useState<Point>({x:0, y:0})
    const location = useLocation()

    useEffect(()=>{
        console.log(location.state)
        if (location.state) {
            setPalette(location.state)
            setColours([location.state.mainColour.rgb || '000000'])
        }
    }, [location])


    function initChosenColour(colour:Colour) {
        setChosenColour(colour)
        setChosenColourRole('mainColour')
        let newValue = cc.rgb2hsv(colour.rgb)?.value 
        if (newValue) setValue(newValue*100)
        let newPosition = rgb2cartesian(colour.rgb)
        setHandlePostion(newPosition)
    }

    function updateChosenColour(colour:Colour, key:PaletteKey, index:number) {
         if (palette) {
            let newPalette:Palette = {...palette}
            switch(key) {
                case 'mainColour':
                    updateMainColour(colour, index)
                    break
                case 'accentColours':
                    updateAccentColour(colour, index)
                    break
                case 'supportColours':
                    updateSupportColour(colour, index)
                    break
                case 'colourVerticies':
                    updateColourVerticies(colour, index)
                    break
                default:
            }
            setChosenColourIndex(index)
        }
    }
    function updateMainColour(colour:Colour, index:number) {
        let newPalette:Palette = {...palette}
        newPalette.mainColour = colour
        for (let i = 0; i < newPalette.colourVerticies.length; i++) {
            if (palette.mainColour.rgb === newPalette.colourVerticies[i].rgb) {
                newPalette.colourVerticies[i] = colour
                break
            }
        }

        setPalette(newPalette)
        setChosenColour(colour)
        setColours([colour.rgb])
        setChosenColourRole('mainColour')
    }
    function updateAccentColour(colour:Colour, index:number) {
        let newPalette:Palette = {...palette}
        for (let i = 0; i < newPalette.colourVerticies.length; i++) {
            if (palette.accentColours[index].rgb === newPalette.colourVerticies[i].rgb) {
                newPalette.colourVerticies[i] = colour
                break
            }
        }
        if (index !== undefined && 
            index >= 0 && 
            index < newPalette.accentColours.length) 
                newPalette.accentColours[index] = colour
        setPalette(newPalette)
        setChosenColour(colour)
        setChosenColourRole('accentColours')

    }
    function updateSupportColour(colour:Colour, index:number) {
        let newPalette:Palette = {...palette}
        if (index !== undefined && 
            index >= 0 && 
            index < newPalette.supportColours.length) 
                newPalette.supportColours[index] = colour
        setPalette(newPalette)
        setChosenColour(colour)
        setChosenColourRole('supportColours')
    }
    function updateColourVerticies(colour:Colour, index:number) {
        let newPalette:Palette = {...palette}
        if (index !== undefined && 
            index >= 0 && 
            index < newPalette.colourVerticies.length) 
                newPalette.colourVerticies[index] = colour
        setPalette(newPalette)
        setChosenColour(colour)
        setChosenColourRole('colourVerticies')
    }

    function rgb2cartesian(rgb:HEX):Point {
        let output:Point = {x:wheelWidth/2 - handleWidth/2, y:wheelWidth/2 - handleWidth/2}   //center of circle
        if (generator) {
            let hsv:HSV|null= generator.converter.rgb2hsv(rgb)
            if (hsv) {
                const theta:number = -(modulo(Math.round(hsv.hue), 360)) * Math.PI / 180
                const radius:number = Math.abs(hsv.saturation) * wheelWidth/2
                output.x = radius * Math.cos(theta) + wheelWidth/2 - handleWidth/2
                output.y = radius * Math.sin(theta) + wheelWidth/2 - handleWidth/2
            }
        }

        return output
    }

    function showColourPicker(colour:Colour, index:number, key:PaletteKey) {
        // colour.index = index
        updateChosenColour(colour, key, index)
        if (colour.hsv) {
            setValue(colour.hsv.value*100)
        }
        let newPosition = rgb2cartesian(colour.rgb)
        setHandlePostion(newPosition)
    }

    function generatePalettes() {
        if (generator) {
            let verticies:Colour[][] = generator.generateColourVerticies(colours[0])
            let palette:Palette = generator.generatePalette(colours[0], verticies[0])
            setPalette(palette)
            initChosenColour(palette.mainColour)
            console.log(palette)
        }
        
    }

    function updateValue(value:number) {
        setValue(value)
        let radius:number = wheelWidth / 2
        let xOffset:number = handleWidth / 2 - radius
        let yOffset:number = handleWidth / 2 - radius

        let hsv = cartesian2hsv({x:position.x, y:position.y}, radius, xOffset, yOffset, value)
        if (hsv) {
            let newColour:string = cc.hsv2rgb(hsv) as string
            let newTestColour={
                rgb:newColour,
                hsv:hsv,
                // index:chosenColour.index
            }
            updateChosenColour(newTestColour, chosenColourRole, chosenColourIndex)
        }
    }

    function makeSelection(value:string) {
        setSelectedHarmony(value)
        if (value in colourHarmonies) {
            setGenerator(colourHarmonies[value as keyof Harmonies].generator)
        }
    }

    useEffect(()=>{
        //get palette from sessionStorage if it exists
    }, [])
    return (
        <ContentBox>
            <section className='bg-neutral-900 w-full py-16 px-24'>
                <div className='w-full px-24 flex gap-16 items-center'>
                    <div className='w-1/2 flex flex-col items-center justify-center gap-16'>
                        <ColourPickerSection colours={colours} setColours={setColours}/>
                    </div>
                    <div className='w-1/2 flex flex-col items-center justify-center gap-16'>
                        <SchemeSelector value={selectedHarmony} setValue={makeSelection} harmonies={colourHarmonies}/>
                        <button className='btn btn-primary w-full' onClick={generatePalettes}>Generate!</button>
                    </div>
                </div>
            </section>
            <section className='bg-neutral-800 w-full py-16 px-24'>
                <div className='grid grid-cols-[1fr_1fr] items-center justify-center gap-4 justify-items-center pb-8'>
                    {
                        palette && 
                            <PaletteSwatchEditor 
                                initPalette={palette} 
                                chosenColour={chosenColour} 
                                chosenColourRole={chosenColourRole} 
                                chosenColourIndex={chosenColourIndex}
                                showColourPicker={showColourPicker}
                            />
                    }
                    <div className='h-full w-full flex items-center justify-center gap-8'>
                        <ColourWheelPicker 
                            colourValue={value} 
                            palette = {palette}
                            generator={generator} 
                            chosenColour={chosenColour}
                            setChosenColour={(colour:Colour)=>updateChosenColour(colour, chosenColourRole, chosenColourIndex)}
                            wheelWidth={wheelWidth}
                            handleWidth={handleWidth}
                            handlePosition={handlePosition}
                            position={position}
                            setPosition={setPosition}
                        />
                        <ValueSlider value={value} updateValue={(value)=>updateValue(value)}/>
                    </div>
                </div>
            </section>

        </ContentBox>
    )
}