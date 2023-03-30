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
        try {
            const user = await UserService.signup(email, password, name)
            res.status(200).send({status:'ok', user:user})
        }
        catch(e:any) {
            console.log
            if (e.message) {
                res.status(500).send({status:'error', error:e.message})
            }
            else {
                console.log(e)
                res.status(500).send({status:'error', error:'Internal Server Error'})
            }
        }
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
            res.status(200).send({status:'ok', user:user})
        }
        catch(e:any) {
            console.log
            if (e.message) {
                res.status(500).send({status:'error', error:e.message})
            }
            else {
                console.log(e)
                res.status(500).send({status:'error', error:'Internal Server Error'})
            }
        }
    }
    static async getUser(req:Request, res:Response, next:NextFunction) {
        const {email} = req.body
        if (!email) {
            res.status(400).send({status:'error', error:'Bad request: Missing email field'})
            return
        }
        try {
            const user = await UserService.getUser(email)
            res.status(200).send({status:'ok', user:user})
        }
        catch(e:any) {
            console.log
            if (e.message) {
                res.status(500).send({status:'error', error:e.message})
            }
            else {
                console.log(e)
                res.status(500).send({status:'error', error:'Internal Server Error'})
            }
        }        
    }
}

export default UserController