import { HEX } from "../types/colours";

export default function ColouredBar(props:{colour:HEX, onSelect?:React.MouseEventHandler}) {
    const {colour, onSelect} = props
    return (
        <div 
            className={`h-full w-full hover:border-primary hover:border-2`} 
            style={{backgroundColor: `#${colour}`}}
            onClick={onSelect}
        />
    )
}