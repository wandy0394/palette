import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Palette, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { fail, Result, success } from "./common/error";
import PaletteGenerator from "./paletteGenerator";
import TriadicSchemeGenerator from "./TriadicSchemeGenerator";

export default class CustomTriadicSchemeGenerator extends TriadicSchemeGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    // generateColourVerticies(rgb:HEX, colourVerticies?:Colour[]): Result<Colour[][], string> {
        
    //     if (colourVerticies?.length === 3) return success([colourVerticies])
    
    //     const angleArray:number[][] = [
    //         [120, -120]
    //     ]
    //     const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
    //     return (result.isSuccess()) ? success(result.value) : fail(result.error)
        
    // } 
    generateColourVerticies(rgb:HEX, colours?:string[]): Result<Colour[][], string> {
        
        if (colours?.length === 3) {
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
            [120, -120]
        ]
        const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
        return (result.isSuccess()) ? success(result.value) : fail(result.error)
        
    } 
    getName():string {
        return "Custom Triadic Colour Scheme"
    }
}