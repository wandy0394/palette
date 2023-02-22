import ColourPickerSection from "../sections/ColourPickerSection";
import { HEX } from "../types/colours";
import {useState} from 'react'




export default function Palette() {
    const [colours, setColours] = useState<HEX[]>(['000011', '000022', '000033'])


    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <section className='bg-neutral-800 w-full py-16'>
                <ColourPickerSection colours={colours} setColours={setColours}/>
            </section>
            <section className='bg-neutral-900 w-full py-16'>

            </section>
        </div>
    )
}