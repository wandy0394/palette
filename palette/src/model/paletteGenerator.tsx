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
    getComplentaryColourScheme(rgb:HEX):HEX[] | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        const complementaryHSV:HSV = {
            hue: (hsv.hue + 180) % 360,
            saturation:hsv.saturation,
            value:hsv.value
        }
        let output:HEX|null = this.converter.hsv2rgb(complementaryHSV)
        if (output === null) return null
        return [rgb.toLowerCase(), output]
    }

    getTriadicColourScheme(rgb:HEX):HEX[] | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        const colour1:HSV = {
            hue: this.#modulo((hsv.hue + 120), 360),
            saturation:hsv.saturation,
            value:hsv.value
        }
        
        const colour2:HSV = {
            hue: this.#modulo((hsv.hue - 120), 360),
            saturation:hsv.saturation,
            value:hsv.value
        }
        
         return this.#formatRGBOutput(rgb, colour1, colour2)
    }

    getSplitComplementaryScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        let output:SchemeOutput = {
            schemes:[
                [],
                [],
                []
            ]
        }

        let angleArray:number[][] = [
            [165, -165],
            [30, -165],
            [-30, 165]
        ]

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

    getAnalogousScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        let output:SchemeOutput = {
            schemes:[
                [],
                [],
                []
            ]
        }
        let angleArray:number[][] = [
            [15, -15],
            [30, 15],
            [-15, -30]
        ]

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

    getSquareScheme(rgb:HEX):HEX[]|null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null


        let colour1:HSV = {
            hue: this.#modulo((hsv.hue + 180), 360),
            saturation:hsv.saturation,
            value:hsv.value
        }
        let colour2:HSV = {
            hue: this.#modulo((hsv.hue + 90), 360),
            saturation:hsv.saturation,
            value:hsv.value
        }
        let colour3:HSV = {
            hue: this.#modulo((hsv.hue - 90), 360),
            saturation:hsv.saturation,
            value:hsv.value
        }
        let output = this.#formatRGBOutput(rgb, colour1, colour2, colour3)
        

        return output              
    }

    getTetraticScheme(rgb:HEX):SchemeOutput | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        let output:SchemeOutput = {
            schemes:[
                [], 
                []
            ]
        }


        let angleArray:number[][] = [
            [30, 180, 210],
            [-30, 180, -210],
        ]

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

}

export default PaletteGenerator