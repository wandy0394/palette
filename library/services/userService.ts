import {Connection} from "mysql2"
import UsersDAO from "../database/usersDAO"
import { User } from "../types/types"
import bcrypt from "bcrypt"
class UserService {

    static injectConn(connection:Connection) {
        UsersDAO.initDb(connection)
    }
    
    static connectionCheck() {
        UsersDAO.checkConnection()
    }

    static async signup(email:string, password:string, name:string):Promise<User> {
        
        // return UsersDAO.userExists(email)
        //     .then(response=>{
        //         return UsersDAO.signup(email, password, name)
        //     })
        //     .catch(response=>{
        //         throw new Error(response)
        //     })
        try {
            const userExists = await UsersDAO.userExists(email)
            if (userExists) {
                throw new Error('User already exists')
            }
            else {
                const result = await UsersDAO.signup(email, password, name)
                return result
                // throw new Error('asdf')
            }
        }
        catch(e) {
            throw(e)
        }
    }

    static async login(email:string, password:string) {
        
        try {
            const user = await UsersDAO.login(email)
            if (user && user.passwordHash) {
                const passwordMatched = await bcrypt.compare(password, user.passwordHash)
                if (!passwordMatched) throw Error('Invalid credentials.')
                return user
            }
            else {
                throw new Error(`User with email ${email} not found`)
            }
        }
        catch(e) {
            throw (e)
        }
    }

    static async getUser(email:string):Promise<User> {
        try {
            const result = await UsersDAO.getUser(email)
            return result
        }
        catch (e) {
            throw(e)
        }
    }

}

export default UserService
