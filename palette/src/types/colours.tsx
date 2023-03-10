export type HEX = string | null
export type HSV = {
    hue:number,
    saturation:number,
    value:number
} | null


export type Palette  = {
    mainColour:Colour
    accentColours:Colour[]
    supportColours:Colour[]
    colourVerticies:Colour[]
} 
export type PaletteKey = 'mainColour' | 'accentColours' | 'colourVerticies' | 'supportColours' | 'none'
export type ColourRole = PaletteKey
export type Colour = {
    rgb:HEX
    hsv:HSV
    // index?:number   
}

// export type ColourElement = {
//     index:number
// } & Colour

export type Scheme = {
    palette:Colour[]
    colourVerticies:Colour[]
} 
