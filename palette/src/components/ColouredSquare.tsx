import { HEX } from "../types/colours";

export default function ColouredSquare(props:{colour:HEX, onSelect?:React.MouseEventHandler}) {
    const {colour, onSelect} = props
    return (
        <div 
            className={`rounded aspect-square border border-solid w-full hover:border-primary hover:border-2`} 
            style={{backgroundColor: `#${colour}`}}
            onClick={onSelect}
        />
                
    )
}