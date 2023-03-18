import {Request, Response, NextFunction} from 'express'
import LibraryService from "../services/libraryService"
import { Result } from '../types/error'
import { Palette, SavedPalette } from '../types/types'

const DUMMY_EMAIL='dev@dev.com'

class LibraryController {
    static async getPalette(req:Request, res:Response, next:NextFunction) {
        LibraryService.getPalette(DUMMY_EMAIL, 1)
            .then(response=>{
                res.status(200).send({data:response})
            })
            .catch(response=>{
                res.status(500).send({error:'Internal server error'})
            })
    }
    static async addPalette(req:Request, res:Response, next:NextFunction) {
        // console.log(req.body.userEmail)
        
        const body = (req.body)
        if (req.body.userId === undefined) {
            res.status(400).send({response:'Missing userId', status:'error'}) 
            return
        }
        if (req.body.userEmail === undefined) {
            res.status(400).send({response:'Missing userEmail', status:'error'}) 
            return
        }
        if (req.body.palette === undefined) {
            res.status(400).send({response:'Missing Palette', status:'error'})
            return
        }
        LibraryService.addPalette(req.body.userEmail, req.body.palette)
            .then(response=>{
                res.status(200).send({response:response, status:'ok'})
            })
            .catch(response=>{
                res.status(500).send({response:response, status:'error'})
            })
    }

    static updatePalette(req:Request, res:Response, next:NextFunction) {
        
        const result = LibraryService.updatePalette(DUMMY_EMAIL)
        res.status(200).json({response:'update'})
    }

    static deletePalette(req:Request, res:Response, next:NextFunction) {
        const body = req.body
        if (req.body.userId === undefined) {
            res.status(400).send({response:'Missing userId', status:'error'}) 
            return
        }
        if (req.body.userEmail === undefined) {
            res.status(400).send({response:'Missing userEmail', status:'error'}) 
            return
        }
        if (req.body.paletteId === undefined) {
            res.status(400).send({response:'Missing PaletteId', status:'error'})
            return
        }

        LibraryService.deletePalette(req.body.userId, req.body.paletteId)
            .then(response=>{
                res.status(200).send({response:'success', status:'ok'})

            })
            .catch(response=>{
                res.status(500).send({response:response, status:'error'})
            })
    }
}

export default LibraryController