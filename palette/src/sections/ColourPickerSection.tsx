import { HEX } from "../types/colours"
import {useState, ChangeEvent} from "react"

type Props = {
    colours: HEX[],
    setColours: React.Dispatch<React.SetStateAction<HEX[]>>
}

type ColourPickerProps = {
    colour: HEX,
    setColour: (colour: HEX) => void
}

function ColourPicker(props:ColourPickerProps) {
    const {colour, setColour} = props
    const [messageVisible, setMessageVisible] = useState<boolean>(false)


    function isValidRGB(rgb:string):boolean {
        const regex = /[0-9A-Fa-f]{6}/g
        if (rgb.match(regex)) return true
        return false
    }

    function handleInputChange(e:ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        //regex checks if input is 6 digit hexadecimal
        
        const value=e.target.value
        if (value.length > 6) return
        if (value.length == 6) {
            setMessageVisible(!isValidRGB(value))
        }
        setColour(e.target.value)
    }

    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <div className={`rounded aspect-square border border-solid w-full hover:border-teal-800 hover:border-2`} style={{backgroundColor: `#${colour}`}}>
                
            </div>
            <div className='w-3/4 flex flex-col'>
                <input className={`input w-full text-center ${messageVisible?'border-red-500':''}`} value={`${colour}`} onChange={(e:ChangeEvent<HTMLInputElement>) => handleInputChange(e)}></input>
                <span className='flex justify-center'>RGB#</span>
            </div>
            <span className='text-red-500' style={{visibility:messageVisible?'visible':'hidden'}}>Invalid RGB value.</span>
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
                        return <ColourPicker key={index} colour={colour} setColour={(colour:HEX)=>setColour(index, colour)}/>
                    })
                }
            </div>

        </div>
    )
}