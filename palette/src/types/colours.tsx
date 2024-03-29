export type HEX = string 
export type HSV = {
    hue:number,
    saturation:number,
    value:number
} 


export type Palette  = {
    mainColour:Colour
    accentColours:Colour[]
    supportColours:Colour[]
    colourVerticies:Colour[]
} 
export type Colour = {
    rgb:HEX
    hsv:HSV
}


export type Scheme = {
    palette:Colour[]
    colourVerticies:Colour[]
} 
