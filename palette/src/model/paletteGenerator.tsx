import { palette } from "@mui/system";
import { InvalidInputError, NullInputError } from "../exceptions/exceptions";
import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Palette, Scheme } from "../types/colours";
import ColourConverter from "./colourConverter";
import { fail, isSuccess, Result, success } from "./common/error";


abstract class PaletteGenerator {
    converter:ColourConverter
    constructor(converter:ColourConverter) {
        this.converter = converter
    }
    #modulo(n:number, m:number):Result<number,string> {
        if (!Number.isInteger(n) || !Number.isInteger(m)) return fail(`Modulo failed. Inputs are not an integers: (${n}, ${m}).\n`)
        return success(n - (m*Math.floor(n/m)))
    }

    // protected sortColoursByHexcode(rgb:HEX[]):Result<HEX[],string> {
    //     //convert hexcode to integer then sort largest to smallest

    //     if (rgb === null || rgb === undefined) return fail('Input is null or undefined')

    //     let colours:number[] = []
    //     rgb.forEach(colour=>{
    //         //check if colour is validRGB first
    //         if (this.converter.isValidRGB(colour)) {
    //             colours.push(parseInt(colour as string, 16))
    //         }
    //         else {
    //             return fail('Input array contains invalid RGB value.')
    //         }
    //     })
    //     colours.sort((a, b)=>(b - a))
    //     return success(colours.map((colour)=>colour.toString(16).padStart(6, '0')))
    // }

    protected sortColoursByHex(colours:Colour[]):Result<Colour[],string> {
        //convert hexcode to integer then sort largest to smallest
        if (colours === null || colours === undefined) return fail('Unable to sort colours. Input is null or undefined.\n')

        let sortedColours:Colour[] = []
        colours.forEach(colour=>{
            sortedColours.push(colour)
        })
        sortedColours.sort((a, b)=>{
            if (b.rgb === null && a.rgb !== null) return -1
            if (b.rgb !== null && a.rgb === null) return 1
            if (b.rgb === null && a.rgb === null) return 0
            return (parseInt(b.rgb as string, 16) - parseInt(a.rgb as string, 16))
        })

        return success(sortedColours)
    }

    #formatRGBOutput(colourRGB:HEX, ...coloursHSV:HSV[]) : Result<Colour[],string> {
        
        //take the original rgb hex and generated hsv colours and output a sorted list of rgb hexcode
        
        const colours:Colour[] = []
        const errorMessage:string = `Unable to format output. rgb:${colourRGB}, hsv:${coloursHSV}\n`
        let hsvResult:Result<HSV,string> = this.converter.rgb2hsv(colourRGB)
        if (hsvResult.isSuccess()) {
            let hsv:HSV = hsvResult.value
            colours.push({
                rgb:colourRGB.toLowerCase(),
                hsv:hsv,
            })
            coloursHSV.forEach(colour=>{
                let result:Result<HEX,string> =this.converter.hsv2rgb(colour)
                if (result.isSuccess()) {
                    let newColour:Colour = {
                        rgb:result.value,
                        hsv:colour
                    }
                    colours.push(newColour)
                }
                else {
                    return fail(errorMessage + result.error)
                }
            })
            
            let result:Result<Colour[], string> = this.sortColoursByHex(colours)
            if (isSuccess(result)) {
                return success(result.value)
            }
            return fail(errorMessage + result.error)
        }
        return fail(errorMessage + hsvResult.error)
    }
    protected hsv2cartesian(hsv:HSV): Result<Point,string> {
        const point:Point = {
            x:0,
            y:0
        }
        if (hsv === null || hsv === undefined) return fail('Unable to convert hsv to point. Input is null or undefined.\n')

        let angleResult:Result<number,string> = this.#modulo(Math.round(hsv.hue), 360)
        if (angleResult.isSuccess()) {
            const theta:number = (angleResult.value) * Math.PI / 180
            const radius:number = Math.abs(hsv.saturation)
            point.x = radius * Math.cos(theta)
            point.y = radius * Math.sin(theta)
        }
        else {
            return fail(`Unable to convert hsv to point. hsv:${hsv}\n` + angleResult.error)
        }
        return success(point)
    }

    protected cartesian2hsv(point:Point):Result<HSV,string> {
        if (point === null || point === undefined) return fail('Unable to convert point to hsv. Input is null or undefined.\n')
        //should also check if point is valid 
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
        return success(hsv)
    }

    protected getColoursByHueAngle(rgb:HEX, hsv:HSV, angleArray:number[][]):Result<Colour[][],string> {
        if (rgb === null || rgb === undefined) return fail('Unable to get colours by hue angle. rgb input is null or undefined.\n')
        if (hsv === null || hsv === undefined) return fail('Unable to get colours by hue angle. hsv is null or undefined.\n')
        if (angleArray === null || angleArray === undefined) return fail('Unable to get colours by hue angle. angleArray input is null or undefined.\n')
        

        let output:Colour[][] = []
        const errorMessage:string = `Unable to get colours by hue angle. rgb:${rgb}, hsv:${hsv}, angleArray:${angleArray}.\n` 
        angleArray.forEach((angles)=>{

            let colours:HSV[] = []
            angles.forEach(angle=>{
                let hueResult:Result<number, string> = this.#modulo((Math.round(hsv.hue) + angle), 360)
                if (hueResult.isSuccess()) {
                    let colour:HSV = {
                        hue: hueResult.value,
                        saturation:hsv.saturation,
                        value:hsv.value
                    }
                    colours.push(colour)
                }
                else {
                    return fail(errorMessage + hueResult.error)
                }

            })
            let result:Result<Colour[], string> = this.#formatRGBOutput(rgb, ...colours) 
            if (result.isSuccess()) {
                output.push(result.value)
            }
            else {
                return fail(errorMessage + result.error)
            }
        })        
        return success(output)
    }

    generateRandomSchemes(colourVerticies:Colour[][]):Result<Scheme[],string> {
        if (colourVerticies === null || colourVerticies === undefined) return fail('Unable to generate random scheme. Input is null or undefined.\n')
        let output:Scheme[] = []
        colourVerticies.forEach(colourList=>{
            let schemeResult:Result<Scheme, string> = this.generateRandomScheme(colourList)
            if (isSuccess(schemeResult)) {
                let scheme:Scheme = schemeResult.value
                if (scheme !== undefined) {
                    scheme.colourVerticies = colourList
                    output.push(scheme)
                }
            }
            else {
                return fail(schemeResult.error)
            }
        })
        return success(output)
    }
    generatePalettes(rgb:HEX):Result<Palette[],string> {
        
        let result:Result<Colour[][], string> = this.generateColourVerticies(rgb)
        const errorMessage:string = `Unable to generate palettes. rgb${rgb}.\n`
        if (isSuccess(result)) {
            let colours:Colour[][] = result.value
            let schemeResult:Result<Scheme[],string>= this.generateRandomSchemes(colours)
            if (schemeResult.isSuccess()) {
                let schemes = schemeResult.value
                let palettes:Palette[] = []
                schemes.forEach(scheme=>{
                    
                    let result:Result<Palette, string> = this.generatePalette(rgb, scheme.colourVerticies)
                    if (isSuccess(result)) {
                        palettes.push(result.value)
                    }
                    else {
                        return fail(errorMessage + result.error)
                    }
     
                })
                return success(palettes)
            }
            else {
                return fail(errorMessage + schemeResult.error)
            }
        }
        // console.error(result.error)
        return fail(errorMessage + result.error)
    }
    generatePalette(rgb:HEX, colourVerticies:Colour[]):Result<Palette, string> {
        if (rgb === null || rgb === undefined) return fail('rgb input is null or undefined')
        if (colourVerticies === null || colourVerticies === undefined) return fail('colourVerticies input is null or undefined')
        
       
        let result:Result<Scheme, string> = this.generateRandomScheme(colourVerticies)
        const errorMessage:string = `Unable to generate palette. rgb:${rgb}, colourVerticies:${colourVerticies}.\n`
        if (isSuccess(result)) {
            let scheme:Scheme = result.value
            let hsvResult:Result<HSV,string> = this.converter.rgb2hsv(rgb)
            if (hsvResult.isSuccess()) {
                let hsv:HSV = hsvResult.value
                let palette:Palette = {
                    mainColour:{
                        rgb:rgb,
                        hsv:hsv
                    },
                    accentColours:scheme.colourVerticies.filter(colour=>colour.rgb !== rgb),
                    colourVerticies:scheme.colourVerticies,
                    supportColours:scheme.palette.filter(colour=>!scheme.colourVerticies.includes(colour))
                }
                return success(palette)
            }
            else {
                return fail(errorMessage + hsvResult.error)
            }
        }
        return fail(errorMessage + result.error)
    }
    // abstract generateColourVerticies(rgb:HEX):Colour[][]
    // abstract generateColourVerticies(rgb:HEX, colourVerticies?:Colour[]):Colour[][]
    abstract generateColourVerticies(rgb:HEX, colourVerticies?:Colour[]):Result<Colour[][], string>
    abstract generateRandomScheme(colours:Colour[]):Result<Scheme,string>

    // abstract generateRandomScheme(colours:Colour[]):Scheme
    // abstract generateColourVerticies(rgb:HEX):HEX[][]
    // abstract generateRandomScheme(colours:HEX[]):Scheme
    abstract getName():string 

}

export default PaletteGenerator