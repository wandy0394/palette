import { HEX } from "../types/colours";

export default function ColouredSquare(props:{colour:HEX}) {
    const {colour} = props
    return (
        <div className={`rounded aspect-square border border-solid w-full hover:border-teal-800 hover:border-2`} style={{backgroundColor: `#${colour}`}}>
                
        </div>
    )
}