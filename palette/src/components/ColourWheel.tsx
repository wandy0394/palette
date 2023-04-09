import ColourConverter from "../model/colourConverter"
import { Result } from "../model/common/error"
import { range } from "../model/common/utils"
import PaletteGenerator from "../model/paletteGenerator"
import { HEX, HSV, Palette, Scheme } from "../types/colours"
import ColourWheelPoint from "./common/ColourWheelPoint"
import ErrorBoundary from "./ErrorBoundary"


const cc = new ColourConverter()
//return an array of HSV that represents the 12 major axes of the colour wheel
//would be more efficient to pre-compute this and just store it rather than calculate at run time
function getWheelHSV(saturation:number, value:number): HSV[] {
    let output:HSV[] = []
    output.push({
        hue:0, 
        saturation:saturation,
        value:value
    })
    let degrees:number = 30
    for (let i = 330; i >= 0; i-= degrees) {
        output.push({
            hue:i, 
            saturation:saturation,
            value:value
        })
    }
    return output
}

//convert HSV array into a string with RGB values
function getRGBColourString(colours:HSV[]):string {
    let output:string = ''

    colours.forEach(colour=>{
        let result:Result<HEX,string> = cc.hsv2rgb(colour)
        if (result.isSuccess()) {
            output += (`#${result.value}, `)
        }
        else {
            //handle error somehow throw exception?
            console.error(result.error)
        }
    })
    //remove trailing white space
    output = output.slice(0, -2)
    return output
}

type Props = {
    palette:Palette
    colourValue?:number,
}

const stepSize:number = 2
const wheelWidths:number[] = range(100, 0, -stepSize)
export default function ColourWheel(props:Props) {
    const {palette, colourValue=100} = props
    let angle:number = 0
    let radius:number = 0
    if (palette.mainColour.hsv) {
        angle = Math.floor(palette.mainColour.hsv.hue) 
        radius = palette.mainColour.hsv.saturation * 1000 + 950 //to scale with 5% width of circle
    }
    return (
        <ErrorBoundary>
            <div className='relative w-full flex items-center justify-center aspect-square'>
                {
                    wheelWidths.map((width, wheelIndex)=>{
                        
                        let saturation:number = (100-((wheelIndex+1)*stepSize)) / 100
                        let wheelHSVs:HSV[] = getWheelHSV(saturation, colourValue/100)
                        let colours = getRGBColourString(wheelHSVs)
                        return (
                            <div 
                                key={`wheel-${wheelIndex}`} 
                                style={{
                                    position:'absolute',
                                    width:`${width}%`, 
                                    aspectRatio:'1/1', 
                                    borderRadius:'100%', 
                                    background:`conic-gradient(${colours})`,
                                    transform:'rotate(90deg)',
                                    zIndex:`${wheelIndex}`
                                }}
                            > 
                            </div>
                        )
                    })
                }

                
                <ColourWheelPoint 
                    colour={palette.mainColour.rgb} 
                    radius={radius} 
                    angle={angle} 
                    scale={5}
                />
                {
                    palette.accentColours.map((colour, index)=>{
                        if (colour) {
                            if (colour.hsv === null) return
                            let angle:number = Math.floor(colour.hsv.hue) 
                            let radius:number = colour.hsv.saturation * (1000) + 950 //to scale with 5% width of circle
                            return (
                                <ColourWheelPoint 
                                    key={`accent-${index}`} 
                                    colour={colour.rgb} 
                                    radius={radius} 
                                    angle={angle} 
                                    scale={5}
                                />
                            )
                        }
                    })
                }
                {
                    palette.supportColours.map((colour, index)=>{
                        if (colour) {
                            if (colour.hsv === null) return
                            let angle:number = Math.floor(colour.hsv.hue) 
                            let radius:number = colour.hsv.saturation * 2500 + 2450 //scales with width of 2%
                            return (
                                <ColourWheelPoint 
                                    key={`support-${index}`} 
                                    colour={colour.rgb} 
                                    radius={radius} 
                                    angle={angle} 
                                    scale={2}
                                />
                            )
                        }
                    })
                }
            </div>
        </ErrorBoundary>
    )
}