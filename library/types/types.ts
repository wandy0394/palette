export type HEX = string 
export type HSV = {
    hue:number,
    saturation:number,
    value:number
} 

export type Session = {
    sessionId:string,
    userEmail:string,
    userId:number,
    id:number
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

export type SavedPalette = {
    uuid:string,
    name?:string,
    date?: Date,
    palette:Palette
}

export type User = {
    id:number,
    name:string,
    email:string,
    passwordHash?:string
}

export type ResponseObject<T> = {
    status:'ok' | 'error'
    data: T
}