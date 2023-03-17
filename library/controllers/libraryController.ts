import {Request, Response, NextFunction} from 'express'
import LibraryService from "../services/libraryService"
import { Palette } from '../types/types'

const DUMMY_EMAIL='dev@dev.com'

class LibraryController {
    static getPalette(req:Request, res:Response, next:NextFunction) {
        const palette = LibraryService.getPalette(DUMMY_EMAIL)
        res.status(200).json({data:palette})
    }

    static addPalette(req:Request, res:Response, next:NextFunction) {
        const body:Palette = req.body as Palette
        const result = LibraryService.addPalette(DUMMY_EMAIL, req.body)
        res.status(200).json({response:'success'})
    }

    static updatePalette(req:Request, res:Response, next:NextFunction) {
        
        const result = LibraryService.updatePalette(DUMMY_EMAIL)
        res.status(200).json({response:'update'})
    }

    static deletePalette(req:Request, res:Response, next:NextFunction) {
        const result = LibraryService.deletePalette(DUMMY_EMAIL)
        res.status(200).json({response:'delete'})

    }
}

export default LibraryController