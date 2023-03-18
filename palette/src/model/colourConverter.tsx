import { InvalidInputError } from "../exceptions/exceptions"
import { HEX, HSV } from "../types/colours"
import { Result, success, fail } from "./common/error"

class ColourConverter {
    isValidRGB(rgb:HEX):boolean {
        if (rgb === null || rgb === undefined) return false
        if (rgb.length !== 6) return false

        const regex = /[0-9A-Fa-f]{6}/g
        if (rgb.match(regex)) return true
        return false
    }

    rgb2hsv(rgb:HEX): Result<HSV,string>  {
        if (rgb === null) return fail('rgb input is null.')
        if (!this.isValidRGB(rgb)) return fail('rgb input is in invalid format.')
        let output:HSV = {
            hue: 0,
            saturation:0,
            value:0
        }

        
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
        //saturation calculation
        let saturation:number = 0
        //saturation is zero if value is zero
        if (value !== 0) {
            saturation = chroma / value
        }

        output.hue = hue
        output.saturation = saturation
        output.value = value

        return success(output)
    }

    hsv2rgb(hsv:HSV):Result<HEX,string>  {
        let output:string = '000000'
        if (hsv === null) return fail('Input is null.')
        if (hsv.hue < 0 || hsv.hue >= 360 || hsv.saturation < 0 || hsv.saturation > 1 || hsv.value < 0 || hsv.value > 1) return fail('Input properties out of range.')
        if (Number.isNaN(hsv.hue)|| Number.isNaN(hsv.saturation) || Number.isNaN(hsv.value)) return fail('Input properties are NaN.')
        
        let chroma:number = hsv.value * hsv.saturation

        let m:number = hsv.value - chroma
        let x:number = chroma * (1-Math.abs((hsv.hue / 60) % 2 - 1))

        let redPrime:number = 0, greenPrime:number = 0, bluePrime:number = 0
        if ((hsv.hue >= 0) && hsv.hue < 60) {
            redPrime = chroma
            greenPrime = x
            bluePrime = 0 
        }
        else if (hsv.hue >= 60 && hsv.hue < 120) {
            redPrime = x
            greenPrime = chroma 
            bluePrime = 0 
        }
        else if (hsv.hue >= 120 && hsv.hue < 180) {
            redPrime = 0
            greenPrime = chroma
            bluePrime = x
        }
        else if (hsv.hue >= 180 && hsv.hue < 240) {
            redPrime = 0
            greenPrime = x
            bluePrime = chroma 
        }
        else if (hsv.hue >= 240 && hsv.hue < 300) {
            redPrime = x
            greenPrime = 0
            bluePrime = chroma
        }
        else if (hsv.hue >= 300 && hsv.hue < 360) {
            redPrime = chroma
            greenPrime = 0
            bluePrime = x
        }

        let red:number = Math.round((redPrime + m) * 255)
        let green:number = Math.round((greenPrime + m) * 255)
        let blue:number = Math.round((bluePrime + m) * 255)
        
        output = red.toString(16).padStart(2, '0') + green.toString(16).padStart(2, '0') + blue.toString(16).padStart(2, '0')

        return success(output)
    }
    
}

export default ColourConverter