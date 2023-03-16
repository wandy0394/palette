import { Palette } from "./colours"

export type SavedPalette = {
    id:number,
    name:string,
    date: Date,
    palette:Palette
}