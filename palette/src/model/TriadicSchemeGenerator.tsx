import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class TriadicSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomScheme(colourVerticies:Colour[]): Scheme {
        //generate 10 random colours within the triangle bounded by the triadic colours

        const coloursCartersian:Point[] = colourVerticies.map(colour=>{
                         return this.hsv2cartesian(colour.hsv)
        })



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

            let rHSV = this.cartesian2hsv(randomPoint)
            if (rHSV) {
                rHSV.hue = Math.floor(rHSV.hue)
                rHSV.value = Math.random()
                let rRGB = this.converter.hsv2rgb(rHSV)
                temp.push({
                    rgb:rRGB,
                    hsv:rHSV
                })

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

        const angleArray:number[][] = [
            [120, -120]
        ]
        
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Triadic Colour Scheme"
    }
}