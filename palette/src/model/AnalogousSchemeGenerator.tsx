import { IncorrectVertexCountError, NullInputError } from "../exceptions/exceptions";
import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { Result, success, fail } from "./common/error";
import PaletteGenerator from "./paletteGenerator";

export default class AnalogousSchemeGenerator extends PaletteGenerator {
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

    generateRandomScheme(colourVerticies:Colour[]): Result<Scheme,string> {
        //generate 10 random colours within the triangle bounded by the square colours

        const errorMessage:string = `Unable to generate random scheme ${colourVerticies}.\n`
        if (colourVerticies === null) return fail(errorMessage + 'Input is null.\n')
        if (colourVerticies.length !== 3) return fail(errorMessage + 'Invalid input. 3 verticies required.\n')

        const hsvPoints:HSV[] = [] 
        //add the origin as a fourth point
        let allColourVerticies:Colour[] = [...colourVerticies, {rgb:'000000', hsv:{hue:0, saturation:0, value:0}}]
        allColourVerticies.forEach((colour)=>{
            hsvPoints.push(colour.hsv)
        })

        //sort hsvPoints by hue in increasing order
        hsvPoints.sort((a,b)=>this.#compare(a,b))

    
        //convert points to cartesian coords
        const cartPoints:Point[] = []
        // hsvPoints.forEach(points=>{
        for (let points of hsvPoints) {
            let pointResult:Result<Point, string> = this.hsv2cartesian(points)
            if (pointResult.isSuccess()) {
                cartPoints.push(pointResult.value)
            }
            else {
                return fail(errorMessage + pointResult.error)
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
        for (let j = 0; j < 5; j++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangles[0][0].x + r1sq*(1-r2)*triangles[0][1].x+ r2*r1sq*triangles[0][2].x,
                y:(1-r1sq)*triangles[0][0].y + r1sq*(1-r2)*triangles[0][1].y+ r2*r1sq*triangles[0][2].y
            } 
            let tempColour:Result<Colour,string> = this.cartesian2Colour(randomPoint)
            if (tempColour.isSuccess()) {
                temp.push(tempColour.value)
            }
            else {
                return fail(errorMessage + tempColour.error)
            }

        }     
        
        //generate random points in each triangle
        for (let j = 0; j < 5; j++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangles[1][0].x + r1sq*(1-r2)*triangles[1][1].x+ r2*r1sq*triangles[1][2].x,
                y:(1-r1sq)*triangles[1][0].y + r1sq*(1-r2)*triangles[1][1].y+ r2*r1sq*triangles[1][2].y
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
        let angleArray:number[][] = [
            [15, -15],
            [30, 15],
            [-15, -30]
        ]
        const result:Result<Colour[][], string> = this.generateColourVerticiesByHueAngles(rgb, angleArray)
        return (result.isSuccess()) ? success(result.value) : fail(result.error)      
    } 
    getName():string {
        return "Analogous Colour Scheme"
    }
}