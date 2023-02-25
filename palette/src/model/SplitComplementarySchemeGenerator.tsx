import { HEX, HSV, SchemeOutput } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class SplitComplementarySchemeGenerator extends PaletteGenerator {
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
            [165, -165],
            [30, -165],
            [-30, 165]
        ]

        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Split Complementary Colour Scheme"
    }
}