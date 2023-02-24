import { HEX, HSV } from "../types/colours";
import ColourConverter from "./colourConverter";

type SchemeOutput = {
    schemes: (HEX[]|null)[]
        
} 
class PaletteGenerator {
    converter:ColourConverter
    constructor(converter:ColourConverter) {
        this.converter = converter
    }
    #modulo(n:number, m:number):number {
        if (!Number.isInteger(n) || !Number.isInteger(m)) return NaN

        return n- (m*Math.floor(n/m))
    }

    #formatRGBOutput(colourRGB:HEX, ...coloursHSV:HSV[]) : HEX[] | null {
        const coloursRGB:(HEX | null)[] = coloursHSV.map(colour=>{
            return this.converter.hsv2rgb(colour)
        })

        if (coloursRGB.some(elem=>elem === null)) return null


        //aim to return colour scheme in ordered format
        let colours:number[] = [parseInt(colourRGB, 16)]
        coloursRGB.forEach(colour=>{
            colours.push(parseInt(colour as string, 16))
        })

        //by default, Javascript sorts alphabetically, pass comparator function to sort numerically, largest to smallest
        colours.sort((a,b)=>(b-a))

        return colours.map((colour)=>colour.toString(16).padStart(6,'0'))
    }

    #getColoursByHueAngle(rgb:HEX, hsv:HSV, angleArray:number[][]):SchemeOutput | null {
        let output:SchemeOutput = {
            schemes: [[]]
        }

        angleArray.forEach((angles, index)=>{
            let colours:HSV[] = angles.map(angle=>{
                let colour:HSV = {
                    hue: this.#modulo((hsv.hue + angle), 360),
                    saturation:hsv.saturation,
                    value:hsv.value
                }
                return colour
            })
            output.schemes[index] = this.#formatRGBOutput(rgb, ...colours)
        })        
        return output
    }

    getComplentaryColourScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        const angleArray:number[][] = [
            [180]
        ]
        return this.#getColoursByHueAngle(rgb, hsv, angleArray)
    }

    getTriadicColourScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        const angleArray:number[][] = [
            [120, -120]
        ]
        
        return this.#getColoursByHueAngle(rgb, hsv, angleArray)
    }

    getSplitComplementaryScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        let angleArray:number[][] = [
            [165, -165],
            [30, -165],
            [-30, 165]
        ]

        return this.#getColoursByHueAngle(rgb, hsv, angleArray)
    }

    getAnalogousScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null


        let angleArray:number[][] = [
            [15, -15],
            [30, 15],
            [-15, -30]
        ]
        return this.#getColoursByHueAngle(rgb, hsv, angleArray)
    }

    getSquareScheme(rgb:HEX):SchemeOutput|null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        let angleArray:number[][] = [
            [180, 90, -90]
        ]

        return this.#getColoursByHueAngle(rgb, hsv, angleArray)              
    }

    getTetraticScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        let angleArray:number[][] = [
            [30, 180, 210],
            [-30, 180, -210]
        ]
        return this.#getColoursByHueAngle(rgb, hsv, angleArray)

    }

}

export default PaletteGenerator