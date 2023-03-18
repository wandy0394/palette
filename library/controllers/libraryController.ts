import {Request, Response, NextFunction} from 'express'
import LibraryService from "../services/libraryService"
import { Result } from '../types/error'
import { Palette, SavedPalette } from '../types/types'

const DUMMY_EMAIL='dev@dev.com'

class LibraryController {
    static async getPalette(req:Request, res:Response, next:NextFunction) {
        LibraryService.getPalette(DUMMY_EMAIL, 1)
            .then(response=>{
                console.log(response)
                res.status(200).json({data:response})
            })
            .catch(response=>{
                res.status(500).json({error:'Internal server error'})
            })
    }
    static addPalette(req:Request, res:Response, next:NextFunction) {
        // console.log(req.body.userEmail)
        const body = (req.body)
        if (req.body.userId === undefined) res.status(400).json({response:'Missing userId', status:'error'})
        if (req.body.userEmail === undefined) res.status(400).json({response:'Missing userEmail', status:'error'})
        if (req.body.palette === undefined) res.status(400).json({response:'Missing Palette', status:'error'})
        // console.log(body.palette)
        //const result = LibraryService.addPalette(req.body.userEmail, req.body.palette)
        res.status(200).json({response:'success', status:'ok'})
    }

    static updatePalette(req:Request, res:Response, next:NextFunction) {
        
        const result = LibraryService.updatePalette(DUMMY_EMAIL)
        res.status(200).json({response:'update'})
    }

    static deletePalette(req:Request, res:Response, next:NextFunction) {
        const body = req.body as {id:string}
        const result = LibraryService.deletePalette(DUMMY_EMAIL, body.id)
        res.status(200).json({response:'delete'})

    }
}

export default LibraryController