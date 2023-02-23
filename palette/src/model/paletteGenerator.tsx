import { HEX, HSV } from "../types/colours";
import ColourConverter from "./colourConverter";

class PaletteGenerator {
    converter:ColourConverter
    constructor(converter:ColourConverter) {
        this.converter = converter
    }
    #modulo(n:number, m:number):number {
        if (!Number.isInteger(n) || !Number.isInteger(m)) return NaN

        return n- (m*Math.floor(n/m))
    }

    getComplentaryColourScheme(rgb:HEX):(HEX | null)[] | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        const complementaryHSV:HSV = {
            hue: (hsv.hue + 180) % 360,
            saturation:hsv.saturation,
            value:hsv.value
        }
        return [rgb.toLowerCase(), this.converter.hsv2rgb(complementaryHSV)]
    }

    getTriadicColourScheme(rgb:HEX):(HEX | null)[] | null {
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
        
        const colour1RGB = this.converter.hsv2rgb(colour1)
        const colour2RGB = this.converter.hsv2rgb(colour2)

        //if invalid colours, return array with nulls, unsorted
        if (colour1RGB === null || colour2RGB === null) return [rgb.toLowerCase(), colour1RGB,  colour2RGB]


        //otherwise, aim to return colour scheme in ordered format
        let colours:number[] = [parseInt(rgb, 16), parseInt(colour1RGB as string, 16), parseInt(colour2RGB as string, 16)]

        //by default, Javascript sorts alphabetically, pass comparator function to sort numerically, largest to smallest
        colours.sort((a,b)=>(b-a))

        return colours.map((colour)=>colour.toString(16).padStart(6,'0'))
    }

}

export default PaletteGenerator