import { palette } from "@mui/system";
import { Point } from "../types/cartesian";
import { Colour, HEX, HSV, Palette, Scheme } from "../types/colours";
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

    protected sortColoursByHex(colours:Colour[]):Colour[] {
        //convert hexcode to integer then sort largest to smallest
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

        //return colours.map((colour)=>colour.toString(16).padStart(6, '0'))
        return sortedColours
    }

    #formatRGBOutput(colourRGB:HEX, ...coloursHSV:HSV[]) : Colour[] {
        //take the original rgb hex and generated hsv colours and output a sorted list of rgb hexcode
        
        const colours:Colour[] = []
        let hsv:HSV = this.converter.rgb2hsv(colourRGB)
        if (hsv && colourRGB) {
            colours.push({
                rgb:colourRGB.toLowerCase(),
                hsv:hsv,
            })
        }
        else return []

        coloursHSV.forEach(colour=>{
            let newColour:Colour = {
                rgb:this.converter.hsv2rgb(colour),
                hsv:colour
            }
            colours.push(newColour)
        })

        if (colours.some(elem=>elem.hsv === null)) return []
        
        
        return this.sortColoursByHex(colours)
    }
    protected hsv2cartesian(hsv:HSV): Point {
        const point:Point = {
            x:0,
            y:0
        }
        if (hsv === null) return point //to clean up error handling
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

    protected getColoursByHueAngle(rgb:HEX, hsv:HSV, angleArray:number[][]):Colour[][] {
        let output:Colour[][] = []
        if (hsv === null) return []  //to clean up error handling
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

    generateRandomSchemes(colourVerticies:Colour[][]):Scheme[] {
        let output:Scheme[] = []
        colourVerticies.forEach(colourList=>{
            let scheme:Scheme = this.generateRandomScheme(colourList)
            if (scheme !== undefined) {
                scheme.colourVerticies = colourList
                output.push(scheme)
            }
        })
        return output
    }
    generatePalettes(rgb:HEX):Palette[] {
        let colours:Colour[][] = this.generateColourVerticies(rgb)
        let schemes:Scheme[] = this.generateRandomSchemes(colours)

  
        let palettes:Palette[] = schemes.map(scheme=>this.generatePalette(rgb, scheme.colourVerticies))

        return palettes
    }
    generatePalette(rgb:HEX, colourVerticies:Colour[]):Palette {
        let scheme:Scheme = this.generateRandomScheme(colourVerticies)
        let hsv:HSV = this.converter.rgb2hsv(rgb)
        let palette:Palette = {
            mainColour:{
                rgb:rgb,
                hsv:hsv
            },
            accentColours:scheme.colourVerticies.filter(colour=>colour.rgb !== rgb),
            colourVerticies:scheme.colourVerticies,
            supportColours:scheme.palette.filter(colour=>!scheme.colourVerticies.includes(colour))
        }
     
        return palette
    }
    // abstract generateColourVerticies(rgb:HEX):Colour[][]
    abstract generateColourVerticies(rgb:HEX, colourVerticies?:Colour[]):Colour[][]
    abstract generateRandomScheme(colours:Colour[]):Scheme
    // abstract generateColourVerticies(rgb:HEX):HEX[][]
    // abstract generateRandomScheme(colours:HEX[]):Scheme
    abstract getName():string 

}

export default PaletteGenerator