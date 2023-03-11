import { Point } from "../../types/cartesian"
import { HSV } from "../../types/colours"

export function modulo(n:number, m:number):number {
    if (!Number.isInteger(n) || !Number.isInteger(m)) return NaN

    return n - (m*Math.floor(n/m))
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