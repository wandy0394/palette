import ContentBox from "../components/common/ContentBox"
import { useState, useEffect } from 'react'
import { HEX, Scheme } from "../types/colours"
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

export default function Editor() {
    const [palette, setPalette] = useState<Scheme>(dummyScheme)
    const [value, setValue] = useState<number>(100)
    const [colours, setColours] = useState<HEX[]>(['ff0000'])
    const [selected, setSelected] = useState<string>('')
    const [generator, setGenerator] = useState<PaletteGenerator|null>(colourHarmonies.complementary.generator)

    function generatePalettes() {
        if (generator) {
            let verticies:HEX[][] = generator.generateColourVerticies(colours[0])
            let newPalette:Scheme = generator.generateRandomScheme(verticies[0])
            setPalette(newPalette)
        }
        
    }


    function updateValue(value:number) {
        setValue(value)
    }

    function makeSelection(value:string) {
        setSelected(value)
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
                        <SchemeSelector value={selected} setValue={makeSelection} harmonies={colourHarmonies}/>
                        <button className='btn btn-primary w-full' onClick={generatePalettes}>Generate!</button>
                    </div>
                </div>
            </section>
            <section className='bg-neutral-800 w-full py-16 px-24'>
                <div className='grid grid-cols-[5fr_1fr] items-center justify-center gap-4 justify-items-center pb-8'>
                    <PaletteSwatchEditor initPalette={palette}/>
                    <div className='h-full w-full flex items-center justify-center gap-8'>
                        {/* {
                            generator &&
                                <ColourWheel palette={palette?.palette} colourVerticies={palette?.colourVerticies} generator={generator} colourValue={value}/>
                        } */}
                        <ValueSlider value={value} updateValue={(value)=>updateValue(value)}/>
                    </div>
                </div>
            </section>

        </ContentBox>
    )
}