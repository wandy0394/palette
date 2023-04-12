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

    generateColourVerticies(rgb:HEX, colours?:string[]): Result<Colour[][], string> {
        
        if (colours?.length === 4) {
            let output:Colour[] = []
            colours.forEach(colour=>{
                let result:Result<HSV,string> = this.converter.rgb2hsv(colour)
                if (result.isSuccess()) {
                    let newColour:Colour = {
                        rgb:colour,
                        hsv:result.value
                    }
                    output.push(newColour)

                }
            })
            return success([output])
        }
        const angleArray:number[][] = [
            [30, 180, 210],
        ]
        const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
        return (result.isSuccess()) ? success(result.value) : fail(result.error)      
    } 

    getName():string {
        return "Custom Tetratic Colour Scheme"
    }
}