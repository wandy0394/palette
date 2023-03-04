import ColourConverter from "../model/colourConverter"
import PaletteGenerator from "../model/paletteGenerator"
import { HEX, HSV } from "../types/colours"


const cc = new ColourConverter()


function range (start:number, stop:number, step:number):number[] {
    let output:number[] = []
    if (start >= stop) {
        for (let i = start; i > stop; i+=step) {
            output.push(i)
        }
    }
    else {
        for (let i = stop; i < stop; i+=step) {
            output.push(i)
        }
    }
    return output
}

function getWheelHSV(saturation:number, value:number): HSV[] {
    let output:HSV[] = []
    output.push({
        hue:0, 
        saturation:saturation,
        value:value
    })
    for (let i = 330; i >= 0; i-= 30) {
        output.push({
            hue:i, 
            saturation:saturation,
            value:value
        })
    }
    return output
}
function getColourString(colours:HSV[]):string {
    let output:string = ''

    colours.forEach(colour=>{
        output += (`#${cc.hsv2rgb(colour)}, `)
    })
    output = output.slice(0, -2)
    return output
}

type Props = {
    palette?:HEX[] | undefined,
    colourValue?:number,
    colourVerticies?:HEX[] | undefined,
    generator?:PaletteGenerator
}

const wheelWidths:number[] = range(100, 0, -2)
export default function ColourWheel(props:Props) {
    const {palette, colourValue=100, colourVerticies, generator} = props
    return (
        <div className='relative flex items-center justify-center aspect-square border-2 border-solid w-full'>
            {
                wheelWidths.map((width, wheelIndex)=>{
                    
                    let saturation:number = (100-((wheelIndex+1)*2)) / 100
                    let wheelHSVs:HSV[] = getWheelHSV(saturation, colourValue/100)
                    let colours = getColourString(wheelHSVs)
                    return (
                        <div style={{
                            position:'absolute',
                            width:`${width}%`, 
                            aspectRatio:'1/1', 
                            borderRadius:'100%', 
                            background:`conic-gradient(${colours})`,
                            transform:'rotate(90deg)',
                            zIndex:`${wheelIndex}`
                        }}> 
                        </div>
                    )
                })
            }
            {
                (colourVerticies !== undefined && generator) &&
                colourVerticies.map(vertex=>{
                    let hsv:HSV|null = generator.converter.rgb2hsv(vertex)
                    if (hsv === null) return
                    let angle:number = Math.floor(hsv.hue) 
                    let radius:number = hsv.saturation * (1900/2) + 50 + (1900/2)
                    return (
                        <div className={`absolute w-full z-[60]`} style={{transform:`rotate(-${angle}deg)`}}>
                            <div className='w-[5%] aspect-square rounded-full border border-solid border-black' style={{backgroundColor:`#${vertex}`, transform:`translate(${radius}%)`}}>
                            </div>
                        </div>
                    )
                })
            }
            {
                (palette !== undefined && generator) &&
                palette.map(vertex=>{
                    if (vertex) {
                        let hsv:HSV|null = generator.converter.rgb2hsv(vertex)
                        if (hsv === null) return
                        let angle:number = Math.floor(hsv.hue) 
                        let radius:number = hsv.saturation * (4900/2) + 50 + (4900/2) //4900 scales with width of 2%
                        return (
                            <div className={`absolute w-full z-50`} style={{transform:`rotate(-${angle}deg)`}}>
                                <div className='w-[2%] aspect-square rounded-full' style={{backgroundColor:`#${vertex}`, transform:`translate(${radius}%)`}}>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}