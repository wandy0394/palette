import { Point } from "../../types/cartesian"
import { Colour, HEX, HSV } from "../../types/colours"
import ColourConverter from "../colourConverter"

export function modulo(n:number, m:number):number {
    if (!Number.isInteger(n) || !Number.isInteger(m)) return NaN

    return n - (m*Math.floor(n/m))
}

export function rgb2cartesian(rgb:HEX, radiusScaler:number, offset:number):Point {
    let output:Point = {x:radiusScaler - offset, y:radiusScaler - offset}   //center of circle
    const cc = new ColourConverter()
        let hsv:HSV|null= cc.rgb2hsv(rgb)
        if (hsv) {
            const theta:number = -(modulo(Math.round(hsv.hue), 360)) * Math.PI / 180
            const radius:number = Math.abs(hsv.saturation) * radiusScaler
            output.x = radius * Math.cos(theta) + radiusScaler - offset
            output.y = radius * Math.sin(theta) + radiusScaler - offset
        }

    return output
}

export function cartesian2hsv(point:Point, radius:number, xOffset:number, yOffset:number, value:number):HSV {
    // let radius = width/2, xCenter = width/2, yCenter = width/2
    const hsv = {
        hue:0,
        saturation:0,
        value:value / 100
    }

    let centeredPoint:Point = {
        x:point.x + xOffset,
        y:-(point.y + yOffset)
    }
    //need to handle case where radius is equal to zero
    if (radius !== 0) hsv.saturation = Math.sqrt(centeredPoint.x*centeredPoint.x + centeredPoint.y*centeredPoint.y) / radius
    
    //according to MDN docs, atan2 handles cales where x == 0
    hsv.hue = Math.atan2(centeredPoint.y, centeredPoint.x) 
    if (hsv.hue < 0) hsv.hue += 2*Math.PI
    hsv.hue  *= (180 / Math.PI)
    return hsv
}



export function range (start:number, stop:number, step:number):number[] {
    let output:number[] = []
    if (start >= stop) {
        for (let i = start; i > stop; i+=step) {
            output.push(i)
        }
    }
    else {
        for (let i = start; i < stop; i+=step) {
            output.push(i)
        }
    }
    return output
}

function isHEX(input:any):boolean {
    return (typeof(input) === 'string')
}

function isHSV(input:any):boolean {
    if (input === null || input === undefined) return false
    if (Object.keys(input).length !== 3) return false
    if (input.hue === undefined || input.saturation === undefined || input.value === undefined) return false
    if (typeof(input.hue) !== 'number' ||  typeof(input.saturation) !== 'number' || typeof(input.value) !== 'number') return false
    return true
}

export function createColour(input:HSV|HEX):Colour {
    let cc = new ColourConverter()
    let colour:Colour = {
        rgb:'000000',
        hsv:{
            hue:0,
            saturation:0,
            value:0
        }
    }
    if (isHEX(input)) {
        colour.rgb = input as HEX
        colour.hsv = cc.rgb2hsv(input as HEX)
    }
    else if (isHSV(input)) {
        colour.rgb = cc.hsv2rgb(input as HSV)
        colour.hsv = input as HSV
    }
    return colour
}
