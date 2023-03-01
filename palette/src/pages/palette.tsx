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

const converter = new ColourConverter()

export default function Palette() {
    const [colours, setColours] = useState<HEX[]>(['1f1f6b'])
    const [dominantColour, setDominantColour] = useState<HEX>('1f1f6b')
    function generatePalettes() {
        setDominantColour(colours[0])
    }

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <section className='bg-neutral-800 w-full py-16 px-24'>
                <ColourPickerSection colours={colours} setColours={setColours}/>
                <button className='btn btn-primary w-full' onClick={generatePalettes}>Generate!</button>
            </section>
            <section className='bg-neutral-900 w-full py-16 px-24'>
                <ColourScheme rgb={dominantColour} generator={new ComplementarySchemeGenerator(converter)}/>
            </section>
            {/* <section className='bg-neutral-800 w-full py-16 px-24'>
                <ColourScheme rgb={dominantColour} generator={new SplitComplementarySchemeGenerator(converter)}/>
            </section>
            <section className='bg-neutral-900 w-full py-16 px-24'>
                <ColourScheme rgb={dominantColour} generator={new TriadicSchemeGenerator(converter)}/>
            </section>
            <section className='bg-neutral-800 w-full py-16 px-24'>
                <ColourScheme rgb={dominantColour} generator={new AnalogousSchemeGenerator(converter)}/>
            </section>
            <section className='bg-neutral-900 w-full py-16 px-24'>
                <ColourScheme rgb={dominantColour} generator={new SquareSchemeGenerator(converter)}/>
            </section>
            <section className='bg-neutral-800 w-full py-16 px-24'>
                <ColourScheme rgb={dominantColour} generator={new TetraticSchemeGenerator(converter)}/>
            </section> */}

        </div>
    )
}