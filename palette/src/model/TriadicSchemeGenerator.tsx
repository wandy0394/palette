import { Point } from "../types/cartesian";
import { HEX, HSV, SchemeOutput } from "../types/colours";
import ColourConverter from "./colourConverter";
import PaletteGenerator from "./paletteGenerator";

export default class TriadicSchemeGenerator extends PaletteGenerator {
    constructor(converter:ColourConverter) {
        super(converter)
    }
    generateRandomSwatch(rgb: string): HEX[][] {
        //generate 10 random colours within the triangle bounded by the triadic colours
        const colours:SchemeOutput = this.generateScheme(rgb)

        const coloursCartersian:Point[] = colours.schemes[0].map(colour=>{
            let hsv:HSV|null = this.converter.rgb2hsv(colour) 
            if (hsv === null) return {x:NaN, y:NaN}
            let point:Point = this.hsv2cartesian(hsv)
            return point
        })

        let p1:Point = coloursCartersian[0]
        let p2:Point = coloursCartersian[1]
        let p3:Point = coloursCartersian[2]

        let temp:HEX[] = []
        for (let i = 0; i < 10; i++) {
            let r1 = Math.random()
            let r2 = Math.random()

            let r1sq = Math.sqrt(r1)
            let randomPoint:Point = {
                x:(1-r1sq)*p1.x + r1sq*(1-r2)*p2.x+ r2*r1sq*p3.x,
                y:(1-r1sq)*p1.y + r1sq*(1-r2)*p2.y+ r2*r1sq*p3.y
            } 

            let rHSV = this.cartesian2hsv(randomPoint)
            rHSV.hue = Math.round(rHSV.hue)
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
            [120, -120]
        ]
        
        return this.getColoursByHueAngle(rgb, hsv, angleArray)
    } 
    getName():string {
        return "Triadic Colour Scheme"
    }
}