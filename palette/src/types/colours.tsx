export type HEX = string
export type HSV = {
    hue:number,
    saturation:number,
    value:number
}

// export type SchemeOutput = {
//     schemes: Scheme[]
        
// } 

export type Scheme = {
    palette:HEX[]
    colourVerticies:HEX[]
}  | undefined
