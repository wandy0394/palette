import { HEX } from "../types/colours"
import {useState, ChangeEvent} from "react"
import ColourConverter from "../model/colourConverter"
import ColouredSquare from "../components/ColouredSquare"
import ErrorBoundary from "../components/ErrorBoundary"

type Props = {
    colours: HEX[],
    setColours: React.Dispatch<React.SetStateAction<HEX[]>>
}

type ColourPickerProps = {
    colour: HEX,
    setColour: (colour: HEX) => void
}
const converter = new ColourConverter()
function ColourPicker(props:ColourPickerProps) {
    const {colour, setColour} = props
    const [messageVisible, setMessageVisible] = useState<boolean>(false)

    function handleInputChange(e:ChangeEvent<HTMLInputElement>) {
        e.preventDefault()
        //regex checks if input is 6 digit hexadecimal
        
        const value=e.target.value
        if (value.length > 6) return
        if (value.length == 6) {
            setMessageVisible(!converter.isValidRGB(value))
        }
        setColour(e.target.value)
    }

    return (
        <div className='w-full flex flex-col items-center justify-center gap-4'>
            <ColouredSquare colour={colour}/>
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
        <ErrorBoundary>
            <div className='flex flex-col items-center justify-center w-full gap-4'>
                <div className='prose flex flex-col items-center '>
                    <h2 className='text-neutral-400'>Choose a favourite colour</h2>
                    <p className='text-neutral-400'>We will generate swatches for you</p>
                </div>
                <div className='w-full md:w-1/2 lg:w-1/4 gap-4 px-16'>
                    {
                        colours.map((colour, index)=>{
                            return <ColourPicker key={index} colour={colour} setColour={(colour:HEX)=>setColour(index, colour)}/>
                        })
                    }
                </div>

            </div>
        </ErrorBoundary>
    )
}