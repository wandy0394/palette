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
            let sqlQuery:string = 'SELECT * from Users LIMIT 1;'
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
    static getPalette(userId:number):Promise<SavedPalette[]> {
        const promise:Promise<SavedPalette[]> = new Promise((resolve, reject)=>{
            try {
                const sqlQuery:string = `SELECT * from Palettes where UserId=?;`
                db.query(sqlQuery, [userId], (err, result, fields)=>{
                    if (err) {
                        console.log(err)
                        return reject(new Error('Error querying database'))
                    }
                    const rows = (result as RowDataPacket[])
                    const output:SavedPalette[] = []
                    rows.forEach(row=>{
                        let palette:SavedPalette = {
                            id:row.Id,
                            name:row.name,
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
                
                reject(e)
            }
        })
        return promise
    }
    static getPaletteById(userId:number, paletteId:number):Promise<SavedPalette[]> {
        const promise:Promise<SavedPalette[]> = new Promise((resolve, reject)=>{
                try {
                    const sqlQuery:string = `SELECT * from Palettes where UserId=? and Id=?;`
                    db.query(sqlQuery, [userId, paletteId],(err, result, fields)=>{
                        if (err) {
                            return reject(new Error('Error querying database'))
                        }
                        if ((result as RowDataPacket[]).length > 0) {

                            const row = (result as RowDataPacket[])[0]
                         
                            let palette:SavedPalette[] = [{
                                id:row.Id,
                                name:row.name,
                                palette: {
                                    mainColour:row.MainColour,
                                    accentColours:row.AccentColours,
                                    supportColours:row.SupportColours,
                                    colourVerticies: row.ColourVerticies
                                }
                            }]
                            resolve(palette)
                        }
                        else {
                            resolve([])
                        }
                    })
                }
                catch (e) {
                    
                    reject(e)
                }
            })
            return promise
    }


    static async addPalette(userId:number, userEmail:string, palette:Palette, name:string):Promise<string> {
        const promise = new Promise<string>((resolve, reject)=>{
            try {
                const mainColour = JSON.stringify(palette.mainColour)
                const accentColours = JSON.stringify(palette.accentColours)
                const supportColours = JSON.stringify(palette.supportColours)
                const colourVerticies = JSON.stringify(palette.colourVerticies)
                
                const values = {
                    name:name,
                    MainColour:mainColour,
                    AccentColours:accentColours,
                    SupportColours:supportColours,
                    ColourVerticies:colourVerticies,
                    UserId:userId
                }

                const sqlQuery:string = `INSERT INTO Palettes set ?;`
                db.query(sqlQuery, [values], (err, results, fields)=>{
                    if (err) {
                        console.log(err)
                        return reject(new Error('Error querying database'))
                    }
                    resolve('ok')
                })
            }
            catch (e) {
                reject(e)
            }
        })
        return promise
    }

    static async updatePalette(userId:number, paletteId:number, palette:Palette, name:string):Promise<string> {
        const promise = new Promise<string>((resolve, reject)=>{
            try {
                const mainColour = JSON.stringify(palette.mainColour)
                const accentColours = JSON.stringify(palette.accentColours)
                const supportColours = JSON.stringify(palette.supportColours)
                const colourVerticies = JSON.stringify(palette.colourVerticies)
                const values = {
                    name:name,
                    MainColour:mainColour,
                    AccentColours:accentColours,
                    SupportColours:supportColours,
                    ColourVerticies:colourVerticies,
                }
                const sqlQuery:string = `Update Palettes SET ? WHERE UserId=? and Id=?;`
                db.query(sqlQuery, [values, userId, paletteId], (err, results, fields)=>{
                    if (err) {
                        console.log(err)
                        return reject(new Error('Error querying database'))
                    }
                    resolve('ok')
                })
            }
            catch (e) {
                reject(e)
            }
        })
        return promise
    }
    static deletePalette(userId:number, id:string):Promise<string> {
        const promise = new Promise<string>((resolve, reject)=>{
            try {
                const sqlQuery:string = `DELETE FROM Palettes WHERE UserId=? and Id=?` 
                // const sqlQuery:string = `DELETE FROM Palettes WHERE UserId=${userId} and Id=${id}` 
                       
                db.query(sqlQuery, [userId, id], (err, results, fields)=>{
                    if (err) {
                        console.log(err)
                        return reject(new Error('Error querying database'))
                    }
                    resolve('ok')
                })
            }
            catch (e) {
                reject(e)
            }
        })
        return promise        
    }
}

export default LibraryDAO