import {Request, Response, NextFunction, CookieOptions} from 'express'
import LibraryService from '../services/libraryService'
import UserService from '../services/userService'
import jwt from "jsonwebtoken"


function createToken(userId:number, email:string) {
    return jwt.sign({userId, email}, process.env.JWT_SECRET as string, {expiresIn:'3d'})
}
class UserController {

    static cookieParameters:CookieOptions = {
        maxAge: 86400,
        sameSite:'none'
        // httpOnly:true,
        // secure: process.env.NODE_ENV === 'production'
    }

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
            const token = createToken(user.id, user.email)
            res.cookie('auth_token', token, UserController.cookieParameters).status(200).send({status:'ok', user:{email:user.email, name:user.name}, token:token})
        }
        catch(e:any) {
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
            const token = createToken(user.id, user.email)
            res.cookie('user', JSON.stringify({email:user.email, name:user.name}))
            res.cookie('auth_token', token, UserController.cookieParameters).status(200).send({status:'ok', user:{email:user.email, name:user.name}, token:token})
        }
        catch(e:any) {
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
            res.status(200).send({status:'ok', user:{email:user.email, name:user.name}})
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