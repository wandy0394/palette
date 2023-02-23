import { HEX, HSV } from "../types/colours";
import ColourConverter from "./colourConverter";

class PaletteGenerator {
    converter:ColourConverter
    constructor(converter:ColourConverter) {
        this.converter = converter
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

    getTriadicColours(rgb:HEX):HEX[] | null {
        const hsv:HSV | null = this.converter.rgb2hsv(rgb)
        if (hsv === null) return null

        const complementaryHSV:HSV = {
            hue: (hsv.hue + 180) % 360,
            saturation:hsv.saturation,
            value:hsv.value
        }
        
        return null
    }

}

export default PaletteGenerator