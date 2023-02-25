import { Point } from "../types/cartesian";
import { HEX, HSV, SchemeOutput } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class ComplementarySchemeGenerator extends PaletteGenerator {
    
    constructor(converter:ColourConverter) {
        super(converter)
    }

    generateRandomSwatch(rgb:HEX):HEX[][] {
        //generate 10 random colours on a 'straight line' between the input colour and its complementary colour
        //moving along the straight line varies hue and saturation, value is randomised
        const colours:SchemeOutput = this.generateScheme(rgb)

        let errorFound:boolean = false
        const coloursCartersian:Point[] = colours.schemes[0].map(colour=>{
            let hsv:HSV|null = this.converter.rgb2hsv(colour) 
            if (hsv === null) {
                errorFound = true
                return {x:NaN, y:NaN}
            }
            let point:Point = this.hsv2cartesian(hsv)
            return point
        })

        if (errorFound) return [[]]

        let p1:Point = coloursCartersian[0]
        let p2:Point = coloursCartersian[1]

        let temp:HEX[] = []
        for (let i = 0; i < 10; i++) {
            let a = Math.random()
            let randomPoint:Point = {
                x:(1-a)*p1.x + a*p2.x,
                y:(1-a)*p1.y + a*p2.y
            } 
            let rHSV = this.cartesian2hsv(randomPoint)
            rHSV.hue = Math.floor(rHSV.hue)
            rHSV.value = Math.random()
            let rRGB = this.converter.hsv2rgb(rHSV) as HEX
            temp.push(rRGB)

        }        
        let output:HEX[][] = [this.sortColoursByHexcode(temp)]
        return output
    }

    generateScheme(rgb:HEX):SchemeOutput {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        const output:SchemeOutput = {
            schemes:[[]]
        }
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

