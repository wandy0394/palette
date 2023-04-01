import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { fail, Result, success } from "./common/error";
import ComplementarySchemeGenerator from "./ComplementarySchemeGenerator";
import PaletteGenerator from "./paletteGenerator";
import TetraticSchemeGenerator from "./TetraticSchemeGenerator";

export default class CustomComplementarySchemeGenerator extends ComplementarySchemeGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }

    generateColourVerticies(rgb:HEX, colours?:string[]): Result<Colour[][], string> {
        
        if (colours?.length === 2) {
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
            [180]
        ]
        const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
        return (result.isSuccess()) ? success(result.value) : fail(result.error)      
    } 

    getName():string {
        return "Custom Tetratic Colour Scheme"
    }
}