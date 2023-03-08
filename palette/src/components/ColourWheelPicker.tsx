import Interactive, { Interaction } from '@uiw/react-drag-event-interactive';
import { useState, useEffect, useRef } from 'react'
import { Point } from '../types/cartesian';
import { Colour, HEX, HSV } from '../types/colours';
import ColourWheel from './ColourWheel';
import ColourConverter from '../model/colourConverter';
import PaletteGenerator from '../model/paletteGenerator';
import { modulo } from '../model/common/utils';

const cc = new ColourConverter()
type Props = {
    colourValue:number,
    palette?:Colour[] | undefined,
    colourVerticies?:Colour[] | undefined,
    generator?:PaletteGenerator
    wheelWidth?:number
    handleWidth?:number
    handlePosition?:Point
    chosenColour:Colour
    position:Point,
    setPosition:React.Dispatch<React.SetStateAction<Point>>
    setChosenColour: (colour:Colour) => void
}

export default function ColourWheelPicker(props:Props) {
    const {
        colourValue=1, 
        wheelWidth=400, 
        handleWidth=20, 
        handlePosition={x:wheelWidth/2 - handleWidth/2, y:wheelWidth/2 - handleWidth/2},
        palette=undefined, 
        colourVerticies=undefined, 
        generator=undefined, 
        chosenColour, 
        position,
        setPosition,
        setChosenColour
    } = props
    // const [position, setPosition] = useState<{x:number, y:number}>({x:0, y:0})
    const [width, setWidth] = useState<number>(wheelWidth)
    //const [handleWidth, setHandleWidth] = useState<number>((wheelWidth/20 > 1) ? (wheelWidth / 20) : 1)
    const [testColour, setTestColour] = useState<Colour>(chosenColour)





    function getCursorPosition(interaction: Interaction):Point {
        let x = (interaction.x < 0) ? 0 : interaction.x 
        let y = (interaction.y < 0) ? 0 : interaction.y
        return {x:x, y:y}
    }

    function cartesian2hsv(point:Point):HSV {
        let radius = width/2, xCenter = width/2, yCenter = width/2
        const hsv = {
            hue:0,
            saturation:0,
            value:colourValue / 100
        }

        let centeredPoint:Point = {
            x:point.x + handleWidth/2 - xCenter,
            y:-point.y - handleWidth/2 + yCenter
        }

        hsv.saturation = Math.sqrt(centeredPoint.x*centeredPoint.x + centeredPoint.y*centeredPoint.y) / radius
        
        //according to MDN docs, atan2 handles cales where x == 0
        hsv.hue = Math.atan2(centeredPoint.y, centeredPoint.x) 
        if (hsv.hue < 0) hsv.hue += 2*Math.PI
        hsv.hue  *= (180 / Math.PI)
        return hsv
    }

    function boundHandleInWheel(point:Point, width:number):Point {
        let radius = width/2, xCenter = width/2, yCenter = width/2
        let output:Point = {
            x:point.x - handleWidth/2 - xCenter,
            y:(point.y - handleWidth/2 - yCenter)
        }
        let r = Math.sqrt(output.x*output.x + output.y*output.y)
        let angle = Math.atan2(output.y, output.x) 

        if (r > radius) {
            output.x = radius*Math.cos(angle) + xCenter - (handleWidth/2)
            output.y = radius*Math.sin(angle) + yCenter - (handleWidth/2)
        }
        else {
            output.x = r*Math.cos(angle) + xCenter
            output.y = r*Math.sin(angle) + yCenter
        }

        return output
    }


    const handleChange = (interaction: Interaction, event: MouseEvent | TouchEvent) => {
        let newPosition = boundHandleInWheel(getCursorPosition(interaction), width)
        setPosition({x:newPosition.x, y:newPosition.y})
        let hsv:HSV = cartesian2hsv({x:newPosition.x, y:newPosition.y})
        let newColour:string = cc.hsv2rgb(hsv) as string
        let newTestColour={
            rgb:newColour,
            hsv:hsv,
            index:testColour.index
        }
        setTestColour(newTestColour)
        setChosenColour(newTestColour)
    }


    //move this such that it is only called on swatch click
    useEffect(()=>{
        setTestColour(chosenColour)
    }, [chosenColour])

    useEffect(()=>{
        setPosition(handlePosition)
    }, [handlePosition])

    return (
        <div className='w-full flex flex-col items-center justify-center gap-4'>
            <Interactive 
                style={{
                    position:'relative', 
                    width:`${width}px`, 
                    height:`${width}px`, 
                    borderRadius:'100%'
                }} 
                onMove={handleChange} 
                onDown={handleChange}>
                <div 
                    className='absolute rounded-full aspect-square z-[80]' 
                    style={{
                        width:`${handleWidth}px`,
                        top:'0', 
                        left:'0', 
                        transform:`translate(${position.x}px, ${position.y}px)`,
                        border:`2px solid  ${(colourValue < 50)?'white':'black'}`
                    }}
                />
                <ColourWheel colourValue={colourValue} palette={palette} colourVerticies={colourVerticies} generator={generator}/>
            </Interactive>
            <div className='w-10 text-2xl' style={{color:`#${testColour.rgb}`}}>
                #{testColour.rgb}
            </div>
        </div>
    )
}