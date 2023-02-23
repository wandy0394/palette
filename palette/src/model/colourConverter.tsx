import { HEX, HSV } from "../types/colours"

class ColourConverter {
    isValidRGB(rgb:HEX):boolean {
        if (rgb.length !== 6) return false
        
        const regex = /[0-9A-Fa-f]{6}/g
        if (rgb.match(regex)) return true
        return false
    }

    rgb2hsv(rgb:HEX): HSV| null {
        let output:HSV = {
            hue: 0,
            saturation:0,
            value:0
        }

        if (!this.isValidRGB(rgb)) return null

 
        //convert hexadecimal strings to decimal, then normalized
        const red:number = parseInt(rgb.substring(0,2), 16) 
        const green:number = parseInt(rgb.substring(2,4), 16) 
        const blue:number = parseInt(rgb.substring(4,6), 16)

        const redNorm:number = red / 255
        const greenNorm:number = green / 255
        const blueNorm:number = blue / 255

        //calculating intermediary values
        const chromaMax:number = Math.max(redNorm, greenNorm, blueNorm)
        const chromaMin:number = Math.min(redNorm, greenNorm, blueNorm)
        const chroma:number = chromaMax - chromaMin

        //value calculation            
        const value:number = chromaMax

        //hue calculation
        let hue:number = 0
        const sixtyDeg:number = 60
        //if chroma is zero, then hue is zero as initialised above
        if (chroma !== 0) {
            switch(value) {
                case redNorm:
                    hue = sixtyDeg * ((greenNorm - blueNorm) % 6) / chroma
                    break;
                case greenNorm:
                    hue = sixtyDeg * (2 + ((blueNorm - redNorm) / chroma))
                    break;
                case blueNorm:
                    hue = sixtyDeg * (4 + ((redNorm - greenNorm) / chroma))
                    break;
                default:
                    hue = 0
                    break;
            }
        }
        if (hue < 0) hue += 360
        // console.log(red, green, blue, hue, value, chroma)
        //saturation calculation
        let saturation:number = 0
        //saturation is zero if value is zero
        if (value !== 0) {
            saturation = chroma / value
        }

        output.hue = hue
        output.saturation = saturation
        output.value = value


        return output
    }
}

export default ColourConverter