import ColourPickerSection from "../sections/ColourPickerSection";

export default function Palette() {
    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <section className='bg-neutral-800 w-full py-16'>
                <ColourPickerSection/>
            </section>
            <section className='bg-neutral-900 w-full py-16'>
                
            </section>
        </div>
    )
}