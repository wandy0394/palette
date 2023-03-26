import {Connection} from "mysql2"
import UsersDAO from "../database/usersDAO"
import { User } from "../types/types"
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
                console.log('exist')
                throw new Error('User already exists')
            }
            else {
                console.log('not exist')
                const result = await UsersDAO.signup(email, password, name)
                return result
                // throw new Error('asdf')
            }
        }
        catch(e) {
            throw(e)
        }
    }

    static async login() {

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
