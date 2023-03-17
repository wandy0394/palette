import LibraryDAO from "../database/libraryDAO";
import { Palette } from "../types/types";

class LibraryService {
    static getPalette(userEmail:string) {
        const data = LibraryDAO.getPalette(userEmail)
        return data
    }

    static updatePalette(userEmail:string) {

    }

    static deletePalette(userEmail:string) {

    }

    static addPalette(userEmail:string, palette:Palette) {
        const result = LibraryDAO.addPalette(userEmail, palette, "DUMMY")
        return result        
    }
}

export default LibraryService