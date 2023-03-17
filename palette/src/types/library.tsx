import { Palette } from "./colours"

export type SavedPalette = {
    id:number,
    name:string,
    email:string,
    date: Date,
    palette:Palette
}