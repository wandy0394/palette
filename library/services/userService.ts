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

    static async signup() {

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
