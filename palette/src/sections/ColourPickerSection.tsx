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
        <div className='w-full grid grid-cols-[1fr_4fr] items-center justify-center gap-4'>
            <div className='flex gap-4 pl-4 items-center'>
                {
                    !messageVisible?
                        <span className='flex justify-center'>RGB#</span>:
                        <span className='text-red-500' style={{visibility:messageVisible?'visible':'hidden'}}>Invalid RGB</span>
                }
                <input className={`input w-full text-center ${messageVisible?'border-red-500':''}`} value={`${colour}`} onChange={(e:ChangeEvent<HTMLInputElement>) => handleInputChange(e)}></input>

            </div>
            <ColouredSquare colour={colour}/>
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
            <div className='flex flex-col items-center justify-center w-full gap-4 '>
                <div className='w-full flex flex-col items-center'>
                        <h2 className='font-bold text-2xl text-neutral-400 w-full'>Choose a colour and we will generate swatches for you.</h2>
                </div>
                <div className='w-full gap-4 '>
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