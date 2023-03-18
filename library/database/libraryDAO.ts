import { Palette, SavedPalette } from "../types/types"
import data from "./dummyData.json"
import fs from 'fs'
import {Connection, ResultSetHeader, OkPacket, RowDataPacket} from 'mysql2'

let db:Connection


type SQLResult = RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader

class LibraryDAO {
    static initDb(newDb:Connection) {
        if (db === undefined) db = newDb
    }

    static checkConnection() {
        if (db) {
            let sqlQuery:string = 'SELECT * from Users;'
            db.query(sqlQuery, (err, results, fields)=>{
                if (err) {
                    console.error(err)
                }
                console.log(results)
                return results
            })
        }
        else {
            console.error('No db')
        }
    }
    // static getPalette(userEmail:string) {
    //     const palettes = data.palettes.filter(p=>p.email === userEmail)
    //     return palettes
    // }

    static getPalette(userEmail:string, userId:number):Promise<SavedPalette[]> {
        const promise:Promise<SavedPalette[]> = new Promise((resolve, reject)=>{
                try {
                    const sqlQuery:string = `SELECT * from Palettes where UserId=${userId};`
                    db.query(sqlQuery, (err, result, fields)=>{
                        if (err) {
                            reject(err)
                        }
                        const rows = (result as RowDataPacket[])
                        const output:SavedPalette[] = []
                        rows.forEach(row=>{
                            let palette:SavedPalette = {
                                id:row.Id,
                                name:row.name,
                                email:userEmail,
                                palette: {
                                    mainColour:row.MainColour,
                                    accentColours:row.AccentColours,
                                    supportColours:row.SupportColours,
                                    colourVerticies: row.ColourVerticies
                                }
                            }
                            output.push(palette)
                        })
                        resolve(output)
                    })
                }
                catch (e) {
                    console.log('error')
                    reject(e)
                }
            })
            return promise
    }

    static addPalette(userId:number, userEmail:string, palette:Palette, name:string) {
        if (db) {
            const mainColour = JSON.stringify(palette.mainColour)
            const accentColours = JSON.stringify(palette.accentColours)
            const supportColours = JSON.stringify(palette.supportColours)
            const colourVerticies = JSON.stringify(palette.colourVerticies)
            console.log(mainColour)

            const sqlQuery:string = `INSERT INTO Palettes 
                                        (
                                            name,
                                            MainColour,
                                            AccentColours,
                                            SupportColours,
                                            ColourVerticies,
                                            UserId
                                        )
                                        VALUES
                                        (
                                            '${name}',
                                            '${mainColour}',
                                            '${accentColours}',
                                            '${supportColours}',
                                            '${colourVerticies}',
                                            ${userId}
                                        )`
            db.query(sqlQuery, (err, results, fields)=>{
                if (err) {
                    console.error(err)
                }
                console.log(results)
                return results
            })
        }
        else {

        }
    }


    static deletePalette(userEmail:string, id:string) {
        
    }
}

export default LibraryDAO