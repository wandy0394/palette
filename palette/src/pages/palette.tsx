import ColourPickerSection from "../sections/ColourPickerSection";
import { HEX } from "../types/colours";
import {useState} from 'react'

import ColourScheme from "../sections/ColourScheme";
import ColourConverter from "../model/colourConverter";
import ComplementarySchemeGenerator from "../model/ComplementarySchemeGenerator"
import TetraticSchemeGenerator from "../model/TetraticSchemeGenerator";
import SquareSchemeGenerator from "../model/SquareSchemeGenerator";
import AnalogousSchemeGenerator from "../model/AnalogousSchemeGenerator";
import TriadicSchemeGenerator from "../model/TriadicSchemeGenerator";
import SplitComplementarySchemeGenerator from "../model/SplitComplementarySchemeGenerator";
import ContentBox from "../components/common/ContentBox";

const converter = new ColourConverter()

export default function Palette() {
    const [colours, setColours] = useState<HEX[]>(['1f1f6b'])
    const [dominantColour, setDominantColour] = useState<HEX>('1f1f6b')
    function generatePalettes() {
        setDominantColour(colours[0])
    }

    return (
        <ContentBox>
            <section className= 'w-full flex flex-col gap-4 py-8 px-8 md:py-16 md:px-24'>
                <ColourPickerSection colours={colours} setColours={setColours}/>
                <button className='btn btn-primary w-full' onClick={generatePalettes}>Generate!</button>
            </section>
           <section className='w-full  px-8  md:px-24'>
                <ColourScheme rgb={dominantColour} generator={new ComplementarySchemeGenerator(converter)}/>
            </section>
            <section className= 'w-full  px-8  md:px-24'>
                <ColourScheme rgb={dominantColour} generator={new SplitComplementarySchemeGenerator(converter)}/>
            </section>
            <section className= 'w-full  px-8  md:px-24'>
                <ColourScheme rgb={dominantColour} generator={new TriadicSchemeGenerator(converter)}/> 
            </section>
            <section className= 'w-full  px-8  md:px-24'>
                <ColourScheme rgb={dominantColour} generator={new AnalogousSchemeGenerator(converter)}/>
            </section>
             <section className= 'w-full  px-8  md:px-24'>
                <ColourScheme rgb={dominantColour} generator={new SquareSchemeGenerator(converter)}/>
            </section>
            <section className= 'w-full  px-8  md:px-24'>
                <ColourScheme rgb={dominantColour} generator={new TetraticSchemeGenerator(converter)}/>
            </section>
        </ContentBox>
    )
}