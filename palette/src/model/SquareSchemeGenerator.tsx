import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
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
    generateRandomScheme(colourVerticies:Colour[]): Scheme {


        //generate 10 random colours within the triangle bounded by the square colours
        const hsvPoints:HSV[] = []
        colourVerticies.forEach(colour=>{
                hsvPoints.push(colour.hsv)
        })


        //sort hsvPoints by hue in increasing order
        hsvPoints.sort((a,b)=>this.#compare(a,b))


        //convert points to cartesian coords
        const cartPoints:Point[] = hsvPoints.map(hsv=>{
            return this.hsv2cartesian(hsv)
        })

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

            let rHSV = this.cartesian2hsv(randomPoint)
            if (rHSV) {
                rHSV.hue = Math.floor(rHSV.hue)
                rHSV.value = Math.random()
                let rRGB = this.converter.hsv2rgb(rHSV)
                temp.push({rgb:rRGB, hsv:rHSV})
            }
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

            let rHSV = this.cartesian2hsv(randomPoint)
            if (rHSV) {
                rHSV.hue = Math.floor(rHSV.hue)
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
            [180, 90, -90]
        ]

        return this.getColoursByHueAngle(rgb, hsv, angleArray)       
    } 
    getName():string {
        return "Square Colour Scheme"
    }
}