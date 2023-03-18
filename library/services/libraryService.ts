import LibraryDAO from "../database/libraryDAO";
import { Palette } from "../types/types";
import {Connection} from "mysql2"

class LibraryService {
    static injectConn(connection:Connection) {
        LibraryDAO.initDb(connection)
    }
    
    static connectionCheck() {
        LibraryDAO.checkConnection()
    }

    static getPalette(userEmail:string) {
        const data = LibraryDAO.getPalette(userEmail)
        return data
    }

    static updatePalette(userEmail:string) {

    }

    static deletePalette(userEmail:string, id:string) {
        const result = LibraryDAO.deletePalette(userEmail, id)
        return result
    }

    static addPalette(userEmail:string, palette:Palette) {
        const result = LibraryDAO.addPalette(1, userEmail, palette, "DUMMY")
        return result        
    }
}

export default LibraryService