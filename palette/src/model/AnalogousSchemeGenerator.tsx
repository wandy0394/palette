import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
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

    generateRandomScheme(colourVerticies:Colour[]): Scheme {
        //generate 10 random colours within the triangle bounded by the square colours
        let errorFound:boolean = false
        const hsvPoints:HSV[] = [] 
        //add the origin as a fourth point
        let allColourVerticies:Colour[] = [...colourVerticies, {rgb:'000000', hsv:{hue:0, saturation:0, value:0}}]
        allColourVerticies.forEach((colour)=>{
            hsvPoints.push(colour.hsv)
        })
        if (errorFound) return undefined

        //sort hsvPoints by hue in increasing order
        hsvPoints.sort((a,b)=>this.#compare(a,b))

    
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
        let temp:Colour[] = []
        for (let j = 0; j < 5; j++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*triangles[0][0].x + r1sq*(1-r2)*triangles[0][1].x+ r2*r1sq*triangles[0][2].x,
                y:(1-r1sq)*triangles[0][0].y + r1sq*(1-r2)*triangles[0][1].y+ r2*r1sq*triangles[0][2].y
            } 

            let rHSV = this.cartesian2hsv(randomPoint)
            if (rHSV) {
                rHSV.hue = Math.floor(rHSV.hue)
                rHSV.value = Math.random()
                let rRGB = this.converter.hsv2rgb(rHSV)
                temp.push({rgb:rRGB, hsv:rHSV})

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

            let rHSV = this.cartesian2hsv(randomPoint)
            if (rHSV) {
                rHSV.hue = Math.round(rHSV.hue)
                rHSV.value = Math.random()
                let rRGB = this.converter.hsv2rgb(rHSV)
                temp.push({rgb:rRGB, hsv:rHSV})

            }
        }   
        let sortedColours:Colour[] = this.sortColoursByHex(temp) 
        let output:Scheme = {
            palette:[...sortedColours, ...colourVerticies],
            colourVerticies:colourVerticies
        }
        
        return output
    }

    generateColourVerticies(rgb:HEX):Colour[][] {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        const output:Colour[][]=[[]]

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