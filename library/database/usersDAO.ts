import {Connection, ResultSetHeader, OkPacket, RowDataPacket} from 'mysql2'
import bcrypt from "bcrypt"
import validator from "validator"
import { User } from '../types/types'


let db:Connection


class UsersDAO {
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

    static async signup(email:string, password:string, name:string):Promise<User>  {
        if (!email || !password || ! name) throw Error('Email, password and name must be filled.')
        if (!validator.isEmail(email)) throw Error('Email is not valid.')
        //if (!validator.isStrongPassword(password)) throw Error ('Password not strong enough.')    
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)  //move this to service layer
        const promise:Promise<User> = new Promise((resolve, reject)=>{
            try {
                const sqlQuery = `INSERT INTO Users
                                    (
                                        name, 
                                        email,
                                        passwordHash
                                    )
                                    VALUES
                                    (
                                        '${name}',
                                        '${email}',
                                        '${hash}'
                                    );
                                `
                db.query(sqlQuery, (err, results:ResultSetHeader, fields)=>{
                    if (err) {
                        console.log(err)
                        reject('Error querying database')
                    }
                    else {
                        resolve({
                            id:results.insertId,
                            name:name,
                            email:email
                        })
                    }
                })
            }
            catch(e) {
                reject(e)
            }
        })

        return promise
    }

    static async getOneUser(email:string):Promise<User> {
        if (!email) throw Error('Email must be filled.')
        if (!validator.isEmail(email)) throw Error('Email is not valid.')

        let user:User = {
            id:-1,
            name:'',
            email:''
        }
        const promise:Promise<User> = new Promise((resolve, reject)=>{
            try {
                const sqlQuery = `SELECT id, name, email, passwordHash from Users where email='${email}' LIMIT 1`
                db.query(sqlQuery, (err, result, fields)=>{
                    if (err) {
                        console.log(err)
                        reject('Error querying database')
                    }
                    else {
                        const rows = (result as RowDataPacket[])
                        console.log(rows.length)
                        if (rows.length <= 0) {
                            reject(`User with email ${email} does not exist.`)
                        }
                        else {
                            user.name = rows[0].name
                            user.email = rows[0].email
                            user.passwordHash = rows[0].passwordHash
                            user.id = rows[0].id
                            console.log(rows[0])
                            resolve(user)
                        }
                    }
                })
            }
            catch(e) {
                reject(e)
            }
        })

        return promise
    }

    static async getUser(email:string):Promise<User> {
        if (!email) throw Error('Email, password must be filled.')
        if (!validator.isEmail(email)) throw Error('Email is not valid.')

        let user:User = {
            id:-1,
            name:'',
            email:''
        }
        const promise:Promise<User> = new Promise((resolve, reject)=>{
            try {
                const sqlQuery = `SELECT * from Users where email='${email}';`
                db.query(sqlQuery, (err, result, fields)=>{
                    if (err) {
                        reject('Error querying database.')
                    }
                    const rows = (result as RowDataPacket[])
                    console.log(rows.length)
                    if (rows.length <= 0) {
                        reject(`User with email ${email} does not exist.`)
                    }
                    else {
                        user.id = rows[0].id
                        user.name = rows[0].name
                        user.email = rows[0].email
                        resolve(user)
                    }
                })
            }
            catch(e) {
                reject(e)
            }
        })

        return promise
    }
    static async userExists(email:string):Promise<boolean> {
        if (!email) throw Error('Email, password must be filled.')
        if (!validator.isEmail(email)) throw Error('Email is not valid.')

        const promise:Promise<boolean> = new Promise((resolve, reject)=>{
            try {
                const sqlQuery = `SELECT 1 from Users where email='${email}' LIMIT 1;`
                db.query(sqlQuery, (err, result, fields)=>{
                    if (err) {
                        reject('Error querying database.')
                    }
                    const rows = (result as RowDataPacket[])
                    if (rows.length <= 0) {
                        resolve(false)
                    }
                    else {
                        resolve(true)
                    }
                })
            }
            catch(e) {
                reject(e)
            }
        })

        return promise
    }
}

export default UsersDAO