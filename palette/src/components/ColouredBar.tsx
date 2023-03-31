import { HEX } from "../types/colours";

export default function ColouredBar(props:{colour:HEX, onSelect?:React.MouseEventHandler, hover?:boolean}) {
    const {colour, onSelect, hover=false} = props
    return (
        <div 
            className={`h-full w-full ${hover?'hover:border-primary hover:border-2':''}`} 
            style={{backgroundColor: `#${colour}`}}
            onClick={onSelect}
        />
    )
}