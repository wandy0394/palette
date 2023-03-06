import ContentBox from "../components/common/ContentBox"
import { useState, useEffect } from 'react'
import { HEX, HSV, Scheme } from "../types/colours"
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
import { modulo } from "../model/common/utils"

const dummyScheme = {
    palette:['ff0000', '00ffff'],
    colourVerticies:['ff0000', '00ffff']
}

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
type ColourChoice = {
    colour:HEX,
    index:number
}
const wheelWidth = 400
const handleWidth = 20
const cc = new ColourConverter()

export default function Editor() {
    const [palette, setPalette] = useState<Scheme>(dummyScheme)
    const [value, setValue] = useState<number>(100)
    const [colours, setColours] = useState<HEX[]>(['ff0000'])
    const [selectedHarmony, setSelectedHarmony] = useState<string>('')
    const [generator, setGenerator] = useState<PaletteGenerator|undefined>(colourHarmonies.complementary.generator)
    const [chosenColour, setChosenColour] = useState<ColourChoice>({colour:'ffffff', index:-1})
    const [handlePosition, setHandlePostion] = useState<Point>({x:wheelWidth/2 - handleWidth/2, y:wheelWidth/2 - handleWidth/2})
    const [position, setPosition] = useState<Point>({x:0, y:0})

    //const [chosenIndex, setChosenIndex] = useState<number>()

    function updateChosenColour(colourChoice:ColourChoice, newPalette?:Scheme) {
        if (newPalette) {
            setPalette(newPalette)
            setChosenColour(colourChoice)
            let newValue = cc.rgb2hsv(colourChoice.colour)?.value 
            if (newValue) setValue(newValue*100)
            let newPosition = rgb2cartesian(colourChoice.colour)
            setHandlePostion(newPosition)
        }
        else if (palette) {
            let newPalette:Scheme = {...palette}
            let newSwatch:HEX[] = [...palette.palette]
            newSwatch[colourChoice.index] = colourChoice.colour
            newPalette.palette = newSwatch
            setPalette(newPalette)
            setChosenColour(colourChoice)
        }
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

    function showColourPicker(colour:HEX, index:number) {
        updateChosenColour({colour:colour, index:index})
        if (generator) {
            let hsv = generator.converter.rgb2hsv(colour)
            if (hsv) setValue(hsv.value*100)
        }
        let newPosition = rgb2cartesian(colour)
        setHandlePostion(newPosition)
    }

    function generatePalettes() {
        if (generator) {
            let verticies:HEX[][] = generator.generateColourVerticies(colours[0])
            let newPalette:Scheme = generator.generateRandomScheme(verticies[0])
            //etPalette(newPalette)
            updateChosenColour({colour:colours[0], index:newPalette?.palette.indexOf(colours[0]) as number}, newPalette)
        }
        
    }

    function cartesian2hsv(point:Point):HSV {
        let radius = wheelWidth/2, xCenter = wheelWidth/2, yCenter = wheelWidth/2
        const hsv = {
            hue:0,
            saturation:0,
            value:value / 100
        }

        let centeredPoint:Point = {
            x:point.x + handleWidth/2 - xCenter,
            y:-point.y - handleWidth/2 + yCenter
        }

        hsv.saturation = Math.sqrt(centeredPoint.x*centeredPoint.x + centeredPoint.y*centeredPoint.y) / radius
        
        //according to MDN docs, atan2 handles cales where x == 0
        hsv.hue = Math.atan2(centeredPoint.y, centeredPoint.x) 
        if (hsv.hue < 0) hsv.hue += 2*Math.PI
        hsv.hue  *= (180 / Math.PI)
        return hsv
    }

    function updateValue(value:number) {
        setValue(value)
        let hsv = cartesian2hsv({x:position.x, y:position.y})
        if (hsv) {
            let newColour:string = cc.hsv2rgb(hsv) as string
            let newTestColour={
                colour:newColour,
                index:chosenColour.index
            }
            updateChosenColour(newTestColour)
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
                    <PaletteSwatchEditor initPalette={palette} chosenColour={chosenColour} showColourPicker={showColourPicker}/>
                    <div className='h-full w-full flex items-center justify-center gap-8'>
                        <ColourWheelPicker 
                            colourValue={value} 
                            palette={palette?.palette} 
                            colourVerticies={palette?.colourVerticies} 
                            generator={generator} 
                            chosenColour={chosenColour}
                            setChosenColour={(colour:ColourChoice)=>updateChosenColour(colour)}
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