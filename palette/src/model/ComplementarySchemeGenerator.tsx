import { Point } from "../types/cartesian";
import { Colour, HEX, HSV,  Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { fail, Result, success } from "./common/error";
import PaletteGenerator from "./paletteGenerator";

export default class ComplementarySchemeGenerator extends PaletteGenerator {
    
    constructor(converter:ColourConverter) {
        super(converter)
    }

    generateRandomScheme(colourVerticies:Colour[]):Result<Scheme,string>  {
        //generate 10 random colours on a 'straight line' between the input colour and its complementary colour
        //moving along the straight line varies hue and saturation, value is randomised
        const errorMessage:string = `Unable to generate random scheme ${JSON.stringify(colourVerticies)}.\n`
        if (colourVerticies === null) return fail(errorMessage + 'Input is null.\n')
        if (colourVerticies.length !== 2) return fail(errorMessage + 'Invalid input. 2 verticies required.\n')

        
        let coloursCartersian:Point[] = []
        for (const colour of colourVerticies) {
            let result:Result<Point, string> = this.hsv2cartesian(colour.hsv)
            if (result.isSuccess()) {
                coloursCartersian.push(result.value)
            }
            else {
                return fail(errorMessage + result.error)
            }
        }


        let p1:Point = coloursCartersian[0]
        let p2:Point = coloursCartersian[1]

        let temp:Colour[] = []
        for (let i = 0; i < 10; i++) {
            let a = Math.random()
            let randomPoint:Point = {
                x:(1-a)*p1.x + a*p2.x,
                y:(1-a)*p1.y + a*p2.y
            } 
            let tempColour:Result<Colour,string> = this.cartesian2Colour(randomPoint)
            if (tempColour.isSuccess()) {
                temp.push(tempColour.value)
            }
            else {
                return fail(errorMessage + tempColour.error)
            }
        }        
        let sortedColours:Result<Colour[],string> = this.sortColoursByHex(temp) 
        if (sortedColours.isSuccess()) {
            let output:Scheme = {
                palette:[...sortedColours.value, ...colourVerticies],
                colourVerticies:colourVerticies
            }
            return success(output)
        }
        else {
            return fail(errorMessage + sortedColours.error)
        }
    }

    generateColourVerticies(rgb:HEX): Result<Colour[][], string> {
        const angleArray:number[][] = [
            [180]
        ]
        const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
        return (result.isSuccess()) ? success(result.value) : fail(result.error)
    }
    
    getName():string {
        return "Complementary Colour Scheme"
    }
}

