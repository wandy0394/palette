import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { Result, success, fail } from "./common/error";
import PaletteGenerator from "./paletteGenerator";

export default class SquareSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    #compare(h1:HSV, h2:HSV):number {
        if (h1 === null && h2 === null) return 0
        if (h1 !== null && h2 === null) return -1
        if (h1 === null && h2 !== null) return 1
        if (h1 !== null && h2 !== null) return (h1.hue - h2.hue)
        
        //typescript complains without this last line
        return 0
    }
    generateRandomScheme(colourVerticies:Colour[]):Result<Scheme,string>  {
        //generate 10 random colours within the triangle bounded by the square colours
        
        const errorMessage:string = `Unable to generate random scheme ${JSON.stringify(colourVerticies)}.\n`
        if (colourVerticies === null) return fail(errorMessage + 'Input is null.\n')
        if (colourVerticies.length !== 4) return fail(errorMessage + 'Invalid input. 4 verticies required.\n')

        const hsvPoints:HSV[] = []
        colourVerticies.forEach(colour=>{
                hsvPoints.push(colour.hsv)
        })


        //sort hsvPoints by hue in increasing order
        hsvPoints.sort((a,b)=>this.#compare(a,b))

        let cartPoints:Point[] = []
        for (const colour of colourVerticies) {
            let result:Result<Point, string> = this.hsv2cartesian(colour.hsv)
            if (result.isSuccess()) {
                cartPoints.push(result.value)
            }
            else {
                return fail(errorMessage + result.error)
            }
        }


        //divide the square into two triangles. The triangle contains the line (hsv[0], hsv[2]) === (cartPoints[0], cartPoints[2])
        const triangle1:Point[] = [
            cartPoints[0],
            cartPoints[1],
            cartPoints[2]
        ]

        const triangle2:Point[] = [
            cartPoints[0],
            cartPoints[2],
            cartPoints[3]
        ]

        let temp:Colour[] = []
        //generate random points in triangle1
        for (let i = 0; i < 4; i++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangle1[0].x + r1sq*(1-r2)*triangle1[1].x+ r2*r1sq*triangle1[2].x,
                y:(1-r1sq)*triangle1[0].y + r1sq*(1-r2)*triangle1[1].y+ r2*r1sq*triangle1[2].y
            } 
            let tempColour:Result<Colour,string> = this.cartesian2Colour(randomPoint)
            if (tempColour.isSuccess()) {
                temp.push(tempColour.value)
            }
            else {
                return fail(errorMessage + tempColour.error)
            }

            // let rHSVResult:Result<HSV,string> = this.cartesian2hsv(randomPoint)
            // let hsv:HSV = {
            //     hue:0,
            //     saturation:0,
            //     value:0
            // }
            // if (rHSVResult.isSuccess()) {
            //     hsv.hue = Math.floor(rHSVResult.value.hue)
            //     hsv.saturation = rHSVResult.value.saturation
            //     hsv.value = Math.random()
            //     let rRGBResult:Result<HEX,string> = this.converter.hsv2rgb(hsv)
            //     if (rRGBResult.isSuccess()) {
            //         temp.push({rgb:rRGBResult.value, hsv:hsv})
            //     }
            //     else {
            //         return fail(errorMessage + rRGBResult.error)
            //     }
            // }
            // else {
            //     return fail(errorMessage + rHSVResult.error)
            // }
        }        


        //generate random points in triangle2 and add onto set of points
        for (let i = 0; i < 4; i++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangle2[0].x + r1sq*(1-r2)*triangle2[1].x+ r2*r1sq*triangle2[2].x,
                y:(1-r1sq)*triangle2[0].y + r1sq*(1-r2)*triangle2[1].y+ r2*r1sq*triangle2[2].y
            } 
            let tempColour:Result<Colour,string> = this.cartesian2Colour(randomPoint)
            if (tempColour.isSuccess()) {
                temp.push(tempColour.value)
            }
            else {
                return fail(errorMessage + tempColour.error)
            }
            // let rHSVResult:Result<HSV,string> = this.cartesian2hsv(randomPoint)
            // let hsv:HSV = {
            //     hue:0,
            //     saturation:0,
            //     value:0
            // }
            // if (rHSVResult.isSuccess()) {
            //     hsv.hue = Math.floor(rHSVResult.value.hue)
            //     hsv.saturation = rHSVResult.value.saturation
            //     hsv.value = Math.random()
            //     let rRGBResult:Result<HEX,string> = this.converter.hsv2rgb(hsv)
            //     if (rRGBResult.isSuccess()) {
            //         temp.push({rgb:rRGBResult.value, hsv:hsv})
            //     }
            //     else {
            //         return fail(errorMessage + rRGBResult.error)
            //     }
            // }
            // else {
            //     return fail(errorMessage + rHSVResult.error)
            // }
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
                [180, 90, -90]
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
        return "Square Colour Scheme"
    }
}