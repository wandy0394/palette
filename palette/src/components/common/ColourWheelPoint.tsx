import { HEX } from "../../types/colours"


export default function ColourWheelPoint(props:{colour:HEX, radius:number, angle:number, scale:number}) {
    const {colour, radius, angle, scale} = props
    
    return (
        <div className={`absolute w-full z-50`} style={{transform:`rotate(-${angle}deg)`}}>
            <div className={`aspect-square rounded-full lg:border lg:border-solid lg:border-black`} 
            style={{width:`${scale}%`, backgroundColor:`#${colour}`, transform:`translate(${radius}%)`}}
            >
            </div>
        </div>
    )
}