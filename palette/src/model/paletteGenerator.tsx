import { palette } from "@mui/system";
import { Point } from "../types/cartesian";
import { HEX, HSV, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";


abstract class PaletteGenerator {
    converter:ColourConverter
    constructor(converter:ColourConverter) {
        this.converter = converter
    }
    #modulo(n:number, m:number):number {
        if (!Number.isInteger(n) || !Number.isInteger(m)) return NaN

        return n - (m*Math.floor(n/m))
    }

    protected sortColoursByHexcode(rgb:HEX[]):HEX[] {
        //convert hexcode to integer then sort largest to smallest
        let colours:number[] = []
        rgb.forEach(colour=>{
            colours.push(parseInt(colour as string, 16))
        })
        colours.sort((a, b)=>(b - a))

        return colours.map((colour)=>colour.toString(16).padStart(6, '0'))
    }

    #formatRGBOutput(colourRGB:HEX, ...coloursHSV:HSV[]) : HEX[] {
        //take the original rgb hex and generated hsv colours and output a sorted list of rgb hexcode
        const coloursRGB:(HEX | null)[] = coloursHSV.map(colour=>{
            return this.converter.hsv2rgb(colour)
        })

        if (coloursRGB.some(elem=>elem === null)) return []
        coloursRGB.push(colourRGB)
        
        return this.sortColoursByHexcode(coloursRGB as HEX[])
    }
    protected hsv2cartesian(hsv:HSV): Point {
        const point:Point = {
            x:0,
            y:0
        }

        const theta:number = (this.#modulo(Math.round(hsv.hue), 360)) * Math.PI / 180
        const radius:number = Math.abs(hsv.saturation)
        point.x = radius * Math.cos(theta)
        point.y = radius * Math.sin(theta)

        return point
    }

    protected cartesian2hsv(point:Point):HSV {
        const hsv = {
            hue:0,
            saturation:0,
            value:0
        }

        hsv.saturation = Math.sqrt(point.x*point.x + point.y*point.y)
        
        //according to MDN docs, atan2 handles cales where x == 0
        hsv.hue = Math.atan2(point.y, point.x) 
        if (hsv.hue < 0) hsv.hue += 2*Math.PI
        hsv.hue  *= (180 / Math.PI)
        return hsv
    }

    protected getColoursByHueAngle(rgb:HEX, hsv:HSV, angleArray:number[][]):HEX[][] {
        let output:HEX[][] = []

        angleArray.forEach((angles, index)=>{

            let colours:HSV[] = angles.map(angle=>{
                let colour:HSV = {
                    hue: this.#modulo((Math.round(hsv.hue) + angle), 360),
                    saturation:hsv.saturation,
                    value:hsv.value
                }
                return colour
            })
            output.push(this.#formatRGBOutput(rgb, ...colours))
        })        
        return output
    }

    // abstract generateScheme(rgb:HEX):SchemeOutput 
    // abstract generateRandomSwatches(rgb:HEX):HEX[][]
    // abstract generateRandomSwatch(scheme:SchemeOutput):HEX[]
    abstract generateSchemes(rgb:HEX):HEX[][]
    //abstract generateRandomSwatches(schemes:Scheme[]):HEX[][]
    abstract generateRandomSwatches(colours:HEX[][]):Scheme[]
    // abstract generateRandomSwatch(scheme:Scheme):HEX[]
    abstract generateRandomSwatch(colours:HEX[]):Scheme
    abstract getName():string 

}

export default PaletteGenerator