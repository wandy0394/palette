import { HEX, HSV, SchemeOutput } from "../types/colours";
import ColourConverter from "./colourConverter";


abstract class PaletteGenerator {
    converter:ColourConverter
    constructor(converter:ColourConverter) {
        this.converter = converter
    }
    #modulo(n:number, m:number):number {
        if (!Number.isInteger(n) || !Number.isInteger(m)) return NaN

        return n- (m*Math.floor(n/m))
    }

    #formatRGBOutput(colourRGB:HEX, ...coloursHSV:HSV[]) : HEX[] {
        const coloursRGB:(HEX | null)[] = coloursHSV.map(colour=>{
            return this.converter.hsv2rgb(colour)
        })

        if (coloursRGB.some(elem=>elem === null)) return []


        //aim to return colour scheme in ordered format
        let colours:number[] = [parseInt(colourRGB, 16)]
        coloursRGB.forEach(colour=>{
            colours.push(parseInt(colour as string, 16))
        })

        //by default, Javascript sorts alphabetically, pass comparator function to sort numerically, largest to smallest
        colours.sort((a,b)=>(b-a))

        return colours.map((colour)=>colour.toString(16).padStart(6,'0'))
    }

    protected getColoursByHueAngle(rgb:HEX, hsv:HSV, angleArray:number[][]):SchemeOutput {
        let output:SchemeOutput = {
            schemes: [[]]
        }

        angleArray.forEach((angles, index)=>{
            let colours:HSV[] = angles.map(angle=>{
                let colour:HSV = {
                    hue: this.#modulo((Math.round(hsv.hue) + angle), 360),
                    saturation:hsv.saturation,
                    value:hsv.value
                }
                return colour
            })
            output.schemes[index] = this.#formatRGBOutput(rgb, ...colours)
        })        
        return output
    }

    abstract generateScheme(rgb:HEX):SchemeOutput 

}

export default PaletteGenerator