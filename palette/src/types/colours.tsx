export type HEX = string | null
export type HSV = {
    hue:number,
    saturation:number,
    value:number
} | null




export type Colour = {
    rgb:HEX
    hsv:HSV
    index?:number
}

export type Scheme = {
    palette:Colour[]
    colourVerticies:Colour[]
}  | undefined
