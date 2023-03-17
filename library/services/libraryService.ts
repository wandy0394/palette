import LibraryDAO from "../database/libraryDAO";
import { Palette } from "../types/types";
import {Connection} from "mysql2"
let db:Connection
class LibraryService {
    static injectConn(connection:Connection) {
        if (db === undefined) {
            db = connection
        }
    }
    
    static connectionCheck() {
        if (db) {
            let sqlQuery:string = 'SELECT * from Users;'
            db.query(sqlQuery, (err, results, fields)=>{
                if (err) {
                    return console.error(err)
                }
                console.log(results)
                return results
            })
        }
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
        const result = LibraryDAO.addPalette(userEmail, palette, "DUMMY")
        return result        
    }
}

export default LibraryService