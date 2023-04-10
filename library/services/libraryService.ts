import LibraryDAO from "../database/libraryDAO";
import { Palette, SavedPalette } from "../types/types";
import {Connection} from "mysql2"
import {v4 as uuid} from 'uuid'

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

    static async getPaletteByUUID(userId:number, paletteUUID:string):Promise<SavedPalette[]> {
        
        const data = LibraryDAO.getPaletteByUUID(userId, paletteUUID)
        return data
    }
    static async updatePalette(userId:number, paletteUUID:string, palette:Palette, name:string):Promise<string> {
        try {
            const result = LibraryDAO.updatePalette(userId, paletteUUID, palette, name)
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

    static async addPalette(userEmail:string, userId:number, palette:Palette, name:string):Promise<string> {
        try {
            const paletteUUID:string = uuid()
            const result = LibraryDAO.addPalette(userId, palette, name, paletteUUID)
            return result        
        }
        catch (e) {
            throw e
        }
    }
}

export default LibraryService