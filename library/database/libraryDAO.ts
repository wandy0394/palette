import { Palette, SavedPalette } from "../types/types"
import data from "./dummyData.json"
import fs from 'fs'
import {Connection} from 'mysql2'

let db:Connection
class LibraryDAO {
    static initDb(newDb:Connection) {
        if (db === undefined) db = newDb
    }

    static checkConnection() {
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
        else {
            console.error('No db')
        }
    }
    static getPalette(userEmail:string) {
        const palettes = data.palettes.filter(p=>p.email === userEmail)
        return palettes
    }

    static addPalette(userId:number, userEmail:string, palette:Palette, name:string) {
        if (db) {
            const mainColour = JSON.stringify(palette.mainColour)
            const accentColours = JSON.stringify(palette.accentColours)
            const supportColours = JSON.stringify(palette.supportColours)
            const colourVerticies = JSON.stringify(palette.colourVerticies)

            const sqlQuery:string = `INSERT INTO PALETTES 
                                        (
                                            name
                                            MainColour,
                                            AccentColours,
                                            SupportColours,
                                            ColourVerticies,
                                            UserId,
                                        )
                                        VALUES
                                        (
                                            '${name}',
                                            ${mainColour},
                                            ${accentColours},
                                            ${supportColours},
                                            ${colourVerticies},
                                            ${userId}
                                        )`
            db.query(sqlQuery, (err, results, fields)=>{
                if (err) {
                    return console.error(err)
                }
                console.log(results)
                return results
            })
        }
        else {

        }
    }

    // static addPalette(userEmail:string, palette:Palette, name:string) {
    //     const id:number = data.palettes.length + 1
    //     const savedPalette = {
    //         id:id,
    //         email:userEmail,
    //         name:name,
    //         palette:palette
    //     }
    //     data.palettes.push(savedPalette)
    //     let hasError:boolean = false
    //     fs.writeFile('./dist/database/dummyData.json', JSON.stringify(data, null, 2), function writeJSON(err) {
    //         if (err) hasError = true
    //     })
        
    //     return !hasError
    // }

    static deletePalette(userEmail:string, id:string) {
        
    }
}

export default LibraryDAO