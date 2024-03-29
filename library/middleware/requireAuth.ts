import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from 'express'


export default function requireAuth(req:Request, res:Response, next:NextFunction) {
    //verify authentcation
    const {authorization} = req.headers
    if (!authorization) return res.status(401).json({status:'error', error:'Auth token missing.'})
    const token = authorization.split(" ")[1]
    try {
        const {userId, email} = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload
        // TODO: check that user exists and has userId matches email
        req.body.userId = userId
        req.body.userEmail = email
        next()
    }
    catch(e) {
        console.log(e)
        res.status(401).json({status:'error', error:'Unauthorised.'})
    }
}
