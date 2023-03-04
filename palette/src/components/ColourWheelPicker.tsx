import Interactive, { Interaction } from '@uiw/react-drag-event-interactive';
import { useState, useEffect, useRef } from 'react'
import { Point } from '../types/cartesian';
import { HSV } from '../types/colours';
import ColourWheel from './ColourWheel';
import ColourConverter from '../model/colourConverter';

const cc = new ColourConverter()

export default function ColourWheelPicker() {
    const [position, setPosition] = useState<{x:number, y:number}>({x:0, y:0})
    const [width, setWidth] = useState<number>(400)
    const [handleWidth, setHandleWidth] = useState<number>(20)
    const [testColour, setTestColour] = useState<string>('')

    function getCursorPosition(interaction: Interaction):Point {
        let x = (interaction.x < 0) ? 0 : interaction.x 
        let y = (interaction.y < 0) ? 0 : interaction.y


        return {x:x, y:y}
    }

    function isHandleInWheel(x:number, y:number, width:number) {
        if (x < -(handleWidth/2) || y < -(handleWidth/2) || x > width || y > width) return false
        return true 
    }


    function cartesian2hsv(point:Point):HSV {
        let radius = width/2, xCenter = width/2, yCenter = width/2
        const hsv = {
            hue:0,
            saturation:0,
            value:1
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
        //console.log(output.x, output.y)
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

        let newColour:string = cc.hsv2rgb(cartesian2hsv({x:newPosition.x, y:newPosition.y})) as string
        //console.log(newColour)
        setTestColour(newColour)
    }

    useEffect(()=>{
        setPosition({x:width/2 - handleWidth/2, y:width/2 - handleWidth/2})
        setHandleWidth(width/20)
    }, [width])
    return (
        <div className='w-full border border-solid border-red-500 flex items-center justify-center'>
            <Interactive 
                style={{
                    position:'relative', 
                    width:`${width}px`, 
                    height:`${width}px`, 
                    border:'1px solid red',
                    borderRadius:'100%'
                }} 
                onMove={handleChange} 
                onDown={handleChange}>
                <div 
                    className='absolute rounded-full aspect-square border-2 border-solid z-[70]' 
                    style={{
                        width:`${handleWidth}px`,
                        top:'0', 
                        left:'0', 
                        transform:`translate(${position.x}px, ${position.y}px)`
                    }}
                />
                <ColourWheel/>
            </Interactive>
            <div className='w-10 text-2xl' style={{color:`#${testColour}`}}>
                #{testColour}
            </div>
        </div>
    )
}