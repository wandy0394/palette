import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { Result, success, fail } from "./common/error";
import PaletteGenerator from "./paletteGenerator";

export default class TetraticSchemeGenerator extends PaletteGenerator {
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
        const triangles:Point[][] = []
        triangles[0] = [
            cartPoints[0],
            cartPoints[1],
            cartPoints[2]
        ]

        triangles[1] = [
            cartPoints[0],
            cartPoints[2],
            cartPoints[3]
        ]


        //generate random points within each triangle. All triangles weighted evenly
        let temp:Colour[] = []
        for (let j = 0; j < 4; j++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangles[0][0].x + r1sq*(1-r2)*triangles[0][1].x+ r2*r1sq*triangles[0][2].x,
                y:(1-r1sq)*triangles[0][0].y + r1sq*(1-r2)*triangles[0][1].y+ r2*r1sq*triangles[0][2].y
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
        
        //generate random points in each triangle
        for (let j = 0; j < 4; j++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangles[1][0].x + r1sq*(1-r2)*triangles[1][1].x+ r2*r1sq*triangles[1][2].x,
                y:(1-r1sq)*triangles[1][0].y + r1sq*(1-r2)*triangles[1][1].y+ r2*r1sq*triangles[1][2].y
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
                [30, 180, 210],
                [-30, 180, -210]
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
        return "Tetratic Colour Scheme"
    }
}