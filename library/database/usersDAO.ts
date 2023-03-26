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
        let user:User = {
            name:'',
            email:''
        }
        const promise:Promise<User> = new Promise((resolve, reject)=>{
            try {

            }
            catch(e) {
                
            }
        })

        return promise
    }

    static async login(email:string, password:string):Promise<User> {
        if (!email || !password) throw Error('Email, password must be filled.')
        let user:User = {
            name:'',
            email:''
        }
        const promise:Promise<User> = new Promise((resolve, reject)=>{
            try {

            }
            catch(e) {

            }
        })

        return promise
    }

    static async getUser(email:string):Promise<User> {
        if (!email) throw Error('Email, password must be filled.')
        if (!validator.isEmail(email)) throw Error('Email is not valid.')

        let user:User = {
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
                        console.log('hello')
                        reject(`User with email ${email} does not exist.`)
                    }
                    else {
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
}

export default UsersDAO