import { Point } from "../types/cartesian";
import { Colour, HEX, HSV,  Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class ComplementarySchemeGenerator extends PaletteGenerator {
    
    constructor(converter:ColourConverter) {
        super(converter)
    }

    generateRandomScheme(colourVerticies:Colour[]):Scheme {
        //generate 10 random colours on a 'straight line' between the input colour and its complementary colour
        //moving along the straight line varies hue and saturation, value is randomised

        const coloursCartersian:Point[] = colourVerticies.map(colour=>{
            return this.hsv2cartesian(colour.hsv)
        })


        let p1:Point = coloursCartersian[0]
        let p2:Point = coloursCartersian[1]

        let temp:Colour[] = []
        for (let i = 0; i < 10; i++) {
            let a = Math.random()
            let randomPoint:Point = {
                x:(1-a)*p1.x + a*p2.x,
                y:(1-a)*p1.y + a*p2.y
            } 
            let rHSV = this.cartesian2hsv(randomPoint)
            if (rHSV) {
                rHSV.hue = Math.floor(rHSV.hue)
                rHSV.value = Math.random()
                let rRGB = this.converter.hsv2rgb(rHSV) as HEX
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
        const output:Colour[][] = [[]]

        if (hsv === null) return output

        const angleArray:number[][] = [
            [180]
        ]
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Complementary Colour Scheme"
    }
}

