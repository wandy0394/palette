import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { Result, success, fail } from "./common/error";
import PaletteGenerator from "./paletteGenerator";

export default class SplitComplementarySchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }

    generateRandomScheme(colourVerticies:Colour[]):Result<Scheme,string>  {

        //generate 10 random colours within the triangle bounded by the split complementary colours
        const errorMessage:string = `Unable to generate random scheme ${JSON.stringify(colourVerticies)}.\n`
        if (colourVerticies === null) return fail(errorMessage + 'Input is null.\n')
        if (colourVerticies.length !== 3) return fail(errorMessage + 'Invalid input. 3 verticies required.\n')
        
        //convert scheme colours from rgb to cartesian coords
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

        //generate random cartesian points within the triangle formed by the 3 colours
        
        let p1:Point = coloursCartersian[0]
        let p2:Point = coloursCartersian[1]
        let p3:Point = coloursCartersian[2]

        let tempArray:Colour[] = []
        for (let i = 0; i < 10; i++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*p1.x + r1sq*(1-r2)*p2.x + r2*r1sq*p3.x,
                y:(1-r1sq)*p1.y + r1sq*(1-r2)*p2.y + r2*r1sq*p3.y
            } 
            let tempColour:Result<Colour,string> = this.cartesian2Colour(randomPoint)
            if (tempColour.isSuccess()) {
                tempArray.push(tempColour.value)
            }
            else {
                return fail(errorMessage + tempColour.error)
            }
        }       
        let sortedColours:Result<Colour[],string> = this.sortColoursByHex(tempArray) 
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
        let angleArray:number[][] = [
            [165, -165],
            [30, -165],
            [-30, 165]
        ]
        const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
        return (result.isSuccess()) ? success(result.value) : fail(result.error)
    } 
    getName():string {
        return "Split Complementary Colour Scheme"
    }
}