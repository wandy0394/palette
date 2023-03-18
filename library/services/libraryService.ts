import LibraryDAO from "../database/libraryDAO";
import { Palette, SavedPalette } from "../types/types";
import {Connection} from "mysql2"
import { fail, Result, success } from "../types/error";

class LibraryService {
    static injectConn(connection:Connection) {
        LibraryDAO.initDb(connection)
    }
    
    static connectionCheck() {
        LibraryDAO.checkConnection()
    }

    static async getPalette(userEmail:string, userId:number):Promise<SavedPalette[]> {
        
        const data = LibraryDAO.getPalette(userEmail, userId)
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