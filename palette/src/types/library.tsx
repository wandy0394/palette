import { Palette } from "./colours"

export type SavedPalette = {
    uuid:string,
    name:string,
    email:string,
    date: Date,
    palette:Palette
}