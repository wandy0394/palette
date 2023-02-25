import { Point } from "../types/cartesian";
import { HEX, HSV, SchemeOutput } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class AnalogousSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomSwatch(rgb:HEX):HEX[] {
        const colours:SchemeOutput = this.generateScheme(rgb)
        const coloursHSV:(HSV|null)[][] = colours.schemes.map(scheme=>{
            return scheme.map(colour=>{
                return this.converter.rgb2hsv(colour)
            })
        })

        const coloursCartersian:Point[][] = colours.schemes.map(scheme=>{
            return scheme.map(colour=>{
                let hsv:HSV|null = this.converter.rgb2hsv(colour) 
                if (hsv === null) return {x:NaN, y:NaN}
                let point:Point = this.hsv2cartesian(hsv)
                return point
            })
        })



        console.log(coloursHSV)
        console.log(coloursCartersian)
        return []
    }
    generateScheme(rgb:HEX):SchemeOutput {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        const output:SchemeOutput = {
            schemes:[[]]
        }
        if (hsv === null) return output


        let angleArray:number[][] = [
            [15, -15],
            [30, 15],
            [-15, -30]
        ]
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Analogous Colour Scheme"
    }
}