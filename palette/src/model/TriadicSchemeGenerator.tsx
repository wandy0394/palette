import { Point } from "../types/cartesian";
import { HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class TriadicSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomScheme(colourVerticies:HEX[]): Scheme {

        //generate 10 random colours within the triangle bounded by the triadic colours
        

        let errorFound:boolean = false
        const coloursCartersian:Point[] = colourVerticies.map(colour=>{
            let hsv:HSV|null = this.converter.rgb2hsv(colour) 
            if (hsv === null) {
                errorFound = true
                return {x:NaN, y:NaN}
            }
            let point:Point = this.hsv2cartesian(hsv)
            return point
        })

        if (errorFound) undefined


        let p1:Point = coloursCartersian[0]
        let p2:Point = coloursCartersian[1]
        let p3:Point = coloursCartersian[2]

        let temp:HEX[] = []
        for (let i = 0; i < 10; i++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*p1.x + r1sq*(1-r2)*p2.x + r2*r1sq*p3.x,
                y:(1-r1sq)*p1.y + r1sq*(1-r2)*p2.y + r2*r1sq*p3.y
            } 

            let rHSV = this.cartesian2hsv(randomPoint)
            rHSV.hue = Math.floor(rHSV.hue)
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
    // generateRandomSchemes(colourVerticies:HEX[][]):Scheme[] {
    //     let output:Scheme[] = []
    //     colourVerticies.forEach(colourList=>{
    //         let scheme:Scheme = this.generateRandomScheme(colourList)
    //         if (scheme !== undefined) {
    //             scheme.colourVerticies = colourList
    //             output.push(scheme)
    //         }
    //     })
    //     return output
    // }
    generateColourVerticies(rgb:HEX):HEX[][] {

        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        const output:HEX[][]=[[]]

        if (hsv === null) return output

        const angleArray:number[][] = [
            [120, -120]
        ]
        
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Triadic Colour Scheme"
    }
}