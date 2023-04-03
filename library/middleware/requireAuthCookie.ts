import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export  default function requireAuthCookie(req:Request, res:Response, next:NextFunction) {
    const token = req.cookies.auth_token
    if (!token) return res.status(403).json({status:'error', error:'Missing authorization token'})
    try {
        const {userId, email} = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload
        req.body.userId = userId
        req.body.userEmail = email
        next()
    }
    catch(e) {
        console.log(e)
        res.status(401).json({status:'error', error:'Unauthorised.'})
    }
}
