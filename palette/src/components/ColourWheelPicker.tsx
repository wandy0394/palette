import Interactive, { Interaction } from '@uiw/react-drag-event-interactive';
import { useState, useEffect, forwardRef } from 'react'
import { Point } from '../types/cartesian';
import { Colour, HSV, Palette } from '../types/colours';
import ColourWheel from './ColourWheel';
import ColourConverter from '../model/colourConverter';
import PaletteGenerator from '../model/paletteGenerator';
import { cartesian2hsv } from '../model/common/utils';
import ErrorBoundary from './ErrorBoundary';

const cc = new ColourConverter()
type Props = {
    colourValue:number
    palette:Palette
    generator?:PaletteGenerator
    wheelWidth?:number
    handleWidth?:number
    handlePosition?:Point
    chosenColour:Colour
    position:Point,
    setPosition:React.Dispatch<React.SetStateAction<Point>>
    setChosenColour: (colour:Colour) => void
}

export default forwardRef(function ColourWheelPicker(props:Props, ref:any) {
    const {
        colourValue=1, 
        wheelWidth=400, 
        handleWidth=20, 
        handlePosition={x:wheelWidth/2 - handleWidth/2, y:wheelWidth/2 - handleWidth/2},
        palette,
        chosenColour, 
        position,
        setPosition,
        setChosenColour
    } = props


    const [sampleColour, setSampleColour] = useState<Colour>(chosenColour)


    function getCursorPosition(interaction: Interaction):Point {
        let x = (interaction.x < 0) ? 0 : interaction.x 
        let y = (interaction.y < 0) ? 0 : interaction.y
        return {x:x, y:y}
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


    const handleChange = (interaction: Interaction) => {
        let newPosition = boundHandleInWheel(getCursorPosition(interaction), wheelWidth)
        setPosition({x:newPosition.x, y:newPosition.y})
        let radius:number = wheelWidth / 2
        let xOffset:number = handleWidth / 2 - radius
        let yOffset:number = handleWidth / 2 - radius

        let hsv:HSV = cartesian2hsv({x:newPosition.x, y:newPosition.y}, radius, xOffset, yOffset, colourValue)
        let newColour:string = cc.hsv2rgb(hsv) as string
        let newSampleColour = {
            rgb:newColour,
            hsv:hsv,
        }
        setSampleColour(newSampleColour)
        setChosenColour(newSampleColour)
    }


    useEffect(()=>{
        setSampleColour(chosenColour)
    }, [chosenColour])

    useEffect(()=>{
        setPosition(handlePosition)
    }, [handlePosition])

    return (
        <ErrorBoundary>

            <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
                <div ref={ref} className='w-full h-full'>
                    <Interactive 
                        
                        style={{
                            position:'relative', 
                            width:'100%',
                            height:'100%',
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
                        <ColourWheel palette={palette} colourValue={colourValue}/>
                    </Interactive>

                </div>
                <div className='w-full text-2xl text-center'>
                    #{sampleColour.rgb}
                </div>
            </div>
        </ErrorBoundary>
    )
})