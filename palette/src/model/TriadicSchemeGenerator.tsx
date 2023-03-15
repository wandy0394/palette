import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { fail, Result, success } from "./common/error";
import PaletteGenerator from "./paletteGenerator";

export default class TriadicSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomScheme(colourVerticies:Colour[]):Result<Scheme,string>  {

        //generate 10 random colours within the triangle bounded by the triadic colours

        const errorMessage:string = `Unable to generate random scheme ${JSON.stringify(colourVerticies)}.\n`
        if (colourVerticies === null) return fail(errorMessage + 'Input is null.\n')
        if (colourVerticies.length !== 3) return fail(errorMessage + 'Invalid input. 3 verticies required.\n')

        
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
        let p3:Point = coloursCartersian[2]

        let temp:Colour[] = []
        for (let i = 0; i < 10; i++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*p1.x + r1sq*(1-r2)*p2.x + r2*r1sq*p3.x,
                y:(1-r1sq)*p1.y + r1sq*(1-r2)*p2.y + r2*r1sq*p3.y
            } 
            let rHSVResult:Result<HSV,string> = this.cartesian2hsv(randomPoint)
            let hsv:HSV = {
                hue:0,
                saturation:0,
                value:0
            }
            if (rHSVResult.isSuccess()) {
                hsv.hue = Math.floor(rHSVResult.value.hue)
                hsv.saturation = rHSVResult.value.saturation
                hsv.value = Math.random()
                let rRGBResult:Result<HEX,string> = this.converter.hsv2rgb(hsv)
                if (rRGBResult.isSuccess()) {
                    temp.push({rgb:rRGBResult.value, hsv:hsv})
                }
                else {
                    return fail(errorMessage + rRGBResult.error)
                }
            }
            else {
                return fail(errorMessage + rHSVResult.error)
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
        const hsvResult:Result<HSV,string>  = this.converter.rgb2hsv(rgb)
        const errorMessage:string = `Unable to generate colour verticies ${rgb}\n.`
        if (hsvResult.isSuccess()) {
            const angleArray:number[][] = [
                [120, -120]
            ]
            let output:Result<Colour[][], string> = this.getColoursByHueAngle(rgb, hsvResult.value, angleArray)
            if (output.isSuccess()) {

                return success(output.value)
            }
            else {
                return fail(errorMessage + output.error)
            }
        }
        else {
            return fail(errorMessage +  hsvResult.error)
        }
    } 
    getName():string {
        return "Triadic Colour Scheme"
    }
}