import p5 from "p5"
import { HEX, Palette } from "../../types/colours"


export function extractColours(palette:Palette):HEX[] {
    const colours1 = palette.colourVerticies.map((colour)=>{
        return `#${colour.rgb}`
    })
    const colours2 = palette.supportColours.map((colour)=>{
        return `#${colour.rgb}`
    })

    return [...colours1, ...colours2]
}

export function randomColourSelect(colours:HEX[]):HEX {
    const randomIndex:number = Math.floor(Math.random() * (colours.length-1))
    return colours[randomIndex]
}