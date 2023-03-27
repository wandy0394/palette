import LibraryDAO from "../database/libraryDAO";
import { Palette, SavedPalette } from "../types/types";
import {Connection} from "mysql2"


class LibraryService {
    static injectConn(connection:Connection) {
        LibraryDAO.initDb(connection)
    }
    
    static connectionCheck() {
        LibraryDAO.checkConnection()
    }


    static async getPalette(userId:number):Promise<SavedPalette[]> {
        
        const data = LibraryDAO.getPalette(userId)
        return data
    }

    static async getPaletteById(userId:number, paletteId:number):Promise<SavedPalette[]> {
        
        const data = LibraryDAO.getPaletteById(userId, paletteId)
        return data
    }
    static async updatePalette(userId:number, paletteId:number, palette:Palette):Promise<string> {
        try {
            const result = LibraryDAO.updatePalette(userId, paletteId, palette)
            return result
        }
        catch (e) {
            throw (e)
        }
    }

    static async deletePalette(userId:number, id:string):Promise<string> {
        try {
            const result = LibraryDAO.deletePalette(userId, id)
            return result
        }
        catch (e) {
            throw e
        }
    }

    static async addPalette(userEmail:string, userId:number, palette:Palette):Promise<string> {
        try {

            const result = LibraryDAO.addPalette(userId, userEmail, palette, "DUMMY")
            return result        
        }
        catch (e) {
            throw e
        }
    }
}

export default LibraryService