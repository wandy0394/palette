import ColourConverter from "../model/colourConverter"
import { range } from "../model/common/utils"
import PaletteGenerator from "../model/paletteGenerator"
import { HSV, Scheme } from "../types/colours"


const cc = new ColourConverter()
//return an array of HSV that represents the 12 major axes of the colour wheel
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
        output += (`#${cc.hsv2rgb(colour)}, `)
    })
    //remove trailing white space
    output = output.slice(0, -2)
    return output
}

type Props = {
    scheme?:Scheme
    colourValue?:number,
    generator?:PaletteGenerator
}

const stepSize:number = 2
const wheelWidths:number[] = range(100, 0, -stepSize)
export default function ColourWheel(props:Props) {
    const {scheme, colourValue=100,  generator} = props
    return (
        <div className='relative flex items-center justify-center aspect-square border-2 border-solid w-full'>
            {
                wheelWidths.map((width, wheelIndex)=>{
                    
                    let saturation:number = (100-((wheelIndex+1)*stepSize)) / 100
                    let wheelHSVs:HSV[] = getWheelHSV(saturation, colourValue/100)
                    let colours = getRGBColourString(wheelHSVs)
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
                (scheme?.colourVerticies && generator) &&
                scheme.colourVerticies.map(vertex=>{
                    if (vertex.hsv === null) return
                    let angle:number = Math.floor(vertex.hsv.hue) 
                    let radius:number = vertex.hsv.saturation * (1900/2) + 50 + (1900/2) //1900 scales with width of 5%
                    return (
                        <div className={`absolute w-full z-[60]`} style={{transform:`rotate(-${angle}deg)`}}>
                            <div className='w-[5%] aspect-square rounded-full border border-solid border-black' style={{backgroundColor:`#${vertex.rgb}`, transform:`translate(${radius}%)`}}>
                            </div>
                        </div>
                    )
                })
            }
            {
                (scheme?.palette && generator) &&
                scheme.palette.map(vertex=>{
                    if (vertex) {
                        if (vertex.hsv === null) return
                        let angle:number = Math.floor(vertex.hsv.hue) 
                        let radius:number = vertex.hsv.saturation * (4900/2) + 50 + (4900/2) //4900 scales with width of 2%
                        return (
                            <div className={`absolute w-full z-50`} style={{transform:`rotate(-${angle}deg)`}}>
                                <div className='w-[2%] aspect-square rounded-full' style={{backgroundColor:`#${vertex.rgb}`, transform:`translate(${radius}%)`}}>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}