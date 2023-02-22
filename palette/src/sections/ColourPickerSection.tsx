import { HEX } from "../types/colours"
import {useState, ChangeEvent} from "react"

type Props = {
    colours: HEX[],
    setColours: React.Dispatch<React.SetStateAction<HEX[]>>
}

type ColourPickerProps = {
    colour: HEX,
    setColour: Function
}

function ColourPicker(props:ColourPickerProps) {
    const {colour, setColour} = props
    // const [colour, setColour] = useState<HEX>(initColour)

    function handleInputChange(e:ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        const value=e.target.value
        if (value.length > 6) return
        setColour(e.target.value)
    }

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className={`rounded aspect-square border border-solid w-full hover:border-teal-800 hover:border-2`} style={{backgroundColor: `#${colour}`}}>
                
            </div>
            <div className='w-3/4 flex flex-col'>
                <input className="input w-full text-center" value={`${colour}`} onChange={(e:ChangeEvent<HTMLInputElement>) => handleInputChange(e)}></input>
                <span className='flex justify-center'>RGB#</span>
            </div>
        </div>
    )
}

export default function ColourPickerSection(props:Props) {
    const {colours, setColours} = props

    function setColour(index:number, colour:HEX) {
        let newColours = [...colours]
        newColours[index] = colour
        setColours(newColours)
    }
    return (
        <div className='flex flex-col items-center justify-center w-full gap-4'>
            <div className='prose flex flex-col items-center'>
                <h2>Choose up to 3 colours</h2>
                <p>We will generate swatches for you</p>
            </div>
            <div className='grid grid-cols-3 w-1/2 gap-4 px-16'>
                {
                    colours.map((colour, index)=>{
                        return <ColourPicker colour={colour} setColour={(colour:HEX)=>setColour(index, colour)}/>
                    })
                }
            </div>
            
        </div>
    )
}