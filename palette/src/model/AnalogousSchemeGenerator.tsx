import { Point } from "../types/cartesian";
import { HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class AnalogousSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomScheme(colourVerticies:HEX[]): Scheme {
        //generate 10 random colours within the triangle bounded by the square colours
        let errorFound:boolean = false
        const hsvPoints:HSV[] = []
        //add the origin as a fourth point
        let allColourVerticies:HEX[] = [...colourVerticies, '000000']
        allColourVerticies.forEach((colour, index)=>{
            let hsv:HSV|null = this.converter.rgb2hsv(colour) 
            if (hsv === null) {
                errorFound = true
            }
            else {
                hsvPoints.push(hsv)
            }
        })
        if (errorFound) return undefined
        //sort hsvPoints by hue in increasing order
            hsvPoints.sort((a,b)=>{
            return a.hue - b.hue
        })
    
        //convert points to cartesian coords
        const cartPoints:Point[] = hsvPoints.map(points=>{
            return this.hsv2cartesian(points)
        })
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
        let temp:HEX[] = []
        for (let j = 0; j < 5; j++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangles[0][0].x + r1sq*(1-r2)*triangles[0][1].x+ r2*r1sq*triangles[0][2].x,
                y:(1-r1sq)*triangles[0][0].y + r1sq*(1-r2)*triangles[0][1].y+ r2*r1sq*triangles[0][2].y
            } 

            let rHSV = this.cartesian2hsv(randomPoint)
            rHSV.hue = Math.floor(rHSV.hue)
            rHSV.value = Math.random()
            let rRGB = this.converter.hsv2rgb(rHSV) as HEX
            temp.push(rRGB)
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

            let rHSV = this.cartesian2hsv(randomPoint)
            rHSV.hue = Math.round(rHSV.hue)
            rHSV.value = Math.random()
            let rRGB = this.converter.hsv2rgb(rHSV) as HEX
            temp.push(rRGB)
        }   
        let sortedColours:HEX[] = this.sortColoursByHexcode(temp) 
        let output:Scheme = {
            palette:[...sortedColours, ...colourVerticies],
            colourVerticies:colourVerticies
        }
        
        return output
    }
    generateRandomSchemes(colourVerticies:HEX[][]):Scheme[] {
        let output:Scheme[] = []
        colourVerticies.forEach(colourList=>{
            let scheme:Scheme = this.generateRandomScheme(colourList)
            if (scheme !== undefined) {
                scheme.colourVerticies = colourList
                output.push(scheme)
            }
        })
        return output
    }
    generateColourVerticies(rgb:HEX):HEX[][] {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        const output:HEX[][]=[[]]

        if (hsv === null) return output


        let angleArray:number[][] = [
            [15, -15],
            [30, 15],
            [-15, -30]
        ]
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Analogous Colour Scheme"
    }
}