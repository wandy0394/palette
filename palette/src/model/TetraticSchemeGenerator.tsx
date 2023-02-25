import { HEX, HSV, SchemeOutput } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class TetraticSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomSwatch(rgb: string): HEX[] {
        return []
    }
    generateScheme(rgb:HEX):SchemeOutput {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        const output:SchemeOutput = {
            schemes:[[]]
        }
        if (hsv === null) return output

        let angleArray:number[][] = [
            [30, 180, 210],
            [-30, 180, -210]
        ]
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Tetratic Complementary Colour Scheme"
    }
}