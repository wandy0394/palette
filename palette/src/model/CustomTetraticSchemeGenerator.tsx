import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { fail, Result, success } from "./common/error";
import PaletteGenerator from "./paletteGenerator";
import TetraticSchemeGenerator from "./TetraticSchemeGenerator";

export default class CustomTetraticSchemeGenerator extends TetraticSchemeGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateColourVerticies(rgb:HEX, colourVerticies?:Colour[]): Result<Colour[][], string> {
        if (colourVerticies?.length === 4) return success([colourVerticies])
        const angleArray:number[][] = [
            [30, 180, 210],
            [-30, 180, -210]
        ]
        const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
        return (result.isSuccess()) ? success(result.value) : fail(result.error)      
    } 
    getName():string {
        return "Custom Tetratic Colour Scheme"
    }
}