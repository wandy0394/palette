import {Request, Response, NextFunction} from 'express'
import UserService from '../services/userService'
import parseCookieHeader from '../util/parseCookieHeader'



export default async function requireAuthCookie(req:Request, res:Response, next:NextFunction) {

    const sid = parseCookieHeader(req.headers?.cookie).sid
    if (!sid) return res.status(403).json({status:'error', data:{error:'Unauthorised.'}})
    try {      
        const result = await UserService.getSessionBySessionId(sid)
        if (Object.keys(result).length > 0) {
            req.body.userId= result.userId
            req.body.userEmail=result.userEmail
            req.body.sessionID=sid
        }
        next()
    }
    catch(e) {
        res.status(403).json({status:'error', data:{error:'Unauthorised.'}})
    }
}
