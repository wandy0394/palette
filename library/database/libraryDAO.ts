import { Palette, SavedPalette } from "../types/types"
import data from "./dummyData.json"
import fs from 'fs'

class LibraryDAO {
    static getPalette(userEmail:string) {
        const palettes = data.palettes.filter(p=>p.email === userEmail)
        return palettes
    }

    static addPalette(userEmail:string, palette:Palette, name:string) {
        const id:number = data.palettes.length + 1
        const savedPalette = {
            id:id,
            email:userEmail,
            name:name,
            palette:palette
        }
        data.palettes.push(savedPalette)
        let hasError:boolean = false
        fs.writeFile('./database/dummyData.json', JSON.stringify(data, null, 2), function writeJSON(err) {
            if (err) hasError = true
        })
        
        return !hasError
    }
}

export default LibraryDAO