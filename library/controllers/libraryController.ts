import {Request, Response, NextFunction} from 'express'
import LibraryService from "../services/libraryService"
import { ResponseObject } from '../types/types'


class LibraryController {
    static async getPalette(req:Request, res:Response, next:NextFunction) {
        const userId = req.body.userId  //id needs to be validated
        if (!userId) {
            res.status(400).json({status:'error', data:{error:'Missing User Id'}})
            return
        }
        if (!(Number.isSafeInteger(userId))) {
            res.status(400).json({status:'error', data:{error:'Invalid User Id'}})
            return
        }
        LibraryService.getPalette(userId)
            .then(response=>{
                const maxAge = 60 * 10
                res.set('Cache-control', `public, max-age=${maxAge}`).status(200).json({status:'ok', data:response})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).json({status:'error', data:{error:response.message}})
                }
                else {
                    console.error(response)
                    res.status(500).json({status:'error', data:{error:'Internal server error'}})
                }
            })
    }
    static async getPaletteByUUID(req:Request, res:Response, next:NextFunction) {
        const paletteUUID = req.params.paletteUUID 
        const userId = parseInt(req.body.userId) //need to check that param is actually integer

        if (!paletteUUID) {
            res.status(400).json({status:'error', data:{error:'Missing Palette UUID'}})
            return
        }
        if (!userId) {
            res.status(400).json({status:'error', data:{error:'Missing User Id'}})
            return
        }
        if (!(Number.isSafeInteger(userId))) {
            res.status(400).json({status:'error', data:{error:'Invalid User Id'}})
            return
        }
        LibraryService.getPaletteByUUID(userId, paletteUUID)
            .then(response=>{
                const maxAge = 60 * 10
                res.set('Cache-control', `public, max-age=${maxAge}`).status(200).send({status:'ok', data:response})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', data:{error:response.message}})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', data:{error:'Internal server error'}})
                }
            })
    }
    static async addPalette(req:Request, res:Response, next:NextFunction) {

        const {userId, userEmail, palette, name} = req.body
        if (userId === undefined) {
            res.status(400).send({data:{error:'Missing userId'}, status:'error'}) 
            return
        }
        if (userEmail === undefined) {
            res.status(400).send({data:{error:'Missing userEmail'}, status:'error'}) 
            return
        }
        if (palette === undefined) {
            res.status(400).send({data:{error:'Missing Palette'}, status:'error'})
            return
        }
        if (name === undefined) {
            res.status(400).send({data:{error:'Missing Name'}, status:'error'})
            return
        }
        LibraryService.addPalette(userEmail, userId, palette, name)
            .then(response=>{
                res.status(200).send({data:response, status:'ok'})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', data:{error:response.message}})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', data:{error:'Internal server error'}})
                }
            })
    }

    static updatePalette(req:Request, res:Response, next:NextFunction) {
        const {paletteUUID, userId, userEmail, palette, name} = req.body
        if (userId === undefined) {
            res.status(400).send({data:{error:'Missing userId'}, status:'error'}) 
            return
        }
        if (userEmail === undefined) {
            res.status(400).send({data:{error:'Missing userEmail'}, status:'error'}) 
            return
        }
        if (palette === undefined) {
            res.status(400).send({data:{error:'Missing Palette'}, status:'error'})
            return
        }
        if (paletteUUID === undefined) {
            res.status(400).send({data:{error:'Missing PaletteUUID'}, status:'error'})
            return
        }
        if (name === undefined) {
            res.status(400).send({data:{error:'Missing Name'}, status:'error'})
            return
        }
        LibraryService.updatePalette(userId, paletteUUID, palette, name)
            .then(response=>{
                res.status(200).send({data:response, status:'ok'})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', data:{error:response.message}})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', data:{error:'Internal server error'}})
                }
            })
    }

    static deletePalette(req:Request, res:Response, next:NextFunction) {
        // const body = req.body
        const {userId, paletteUUID} = req.body
        if (userId === undefined) {
            res.status(400).send({data:{error:'Missing userId'}, status:'error'}) 
            return
        }
        if (paletteUUID === undefined) {
            res.status(400).send({data:{error:'Missing PaletteUUID'}, status:'error'})
            return
        }

        LibraryService.deletePalette(userId, paletteUUID)
            .then(response=>{
                res.status(200).send({data:'success', status:'ok'})

            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', data:{error:response.message}})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', data:{error:'Internal server error'}})
                }
            })
    }
}

export default LibraryController