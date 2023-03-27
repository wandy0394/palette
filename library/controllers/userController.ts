import {Request, Response, NextFunction} from 'express'
import LibraryService from '../services/libraryService'
import UserService from '../services/userService'

class UserController {
    static async signup(req:Request, res:Response, next:NextFunction) {
        const {email, password, name} = req.body
        if (!email) {
            res.status(400).send({status:'error', error:'Bad request: Missing email field'})
            return
        }
        if (!password) {
            res.status(400).send({status:'error', error:'Bad request: Missing password field'})
            return
        }
        if (!name) {
            res.status(400).send({status:'error', error:'Bad request: Missing name field'})
            return
        }
        UserService.signup(email, password, name)
            .then(response=>{
                res.status(200).send({status:'ok', data:response})
            })
            .catch(response=>{
                
                res.status(500).send({status:'error', error:response})
            })
    }

    static async login(req:Request, res:Response, next:NextFunction) {
        const {email, password} = req.body
        if (!email) {
            res.status(400).send({status:'error', error:'Bad request: Missing email field'})
            return
        }
        if (!password) {
            res.status(400).send({status:'error', error:'Bad request: Missing password field'})
            return
        }
        try {
            const user = await UserService.login(email, password)
            res.status(200).send({user:user})
        }
        catch(e) {
            res.status(500).send({error:'Internal server error: ' + e})
        }
    }
    static async getUser(req:Request, res:Response, next:NextFunction) {
        const {email} = req.body
        if (!email) {
            res.status(400).send({status:'error', error:'Bad request: Missing email field'})
            return
        }
        UserService.getUser(email)
            .then(response=>{
                res.status(200).send({user:response})
            })
            .catch(response=>{
                res.status(500).send({error:'Internal server error: ' + response})
            })
    }
}

export default UserController