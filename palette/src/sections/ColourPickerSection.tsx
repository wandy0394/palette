function ColourPicker() {
    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className='rounded bg-neutral-100 aspect-square border border-solid w-full'>
            </div>
            <input className='input'></input>
        </div>
    )
}

export default function ColourPickerSection() {
    return (
        <div className='flex flex-col items-center justify-center w-full gap-4'>
            <div className='prose flex flex-col items-center'>
                <h2>Choose up to 3 colours</h2>
                <p>We will generate swatches for you</p>
            </div>
            <div className='grid grid-cols-3 w-1/2 gap-4 px-16'>
                <ColourPicker/>
                <ColourPicker/>
                <ColourPicker/>
            </div>
            
        </div>
    )
}