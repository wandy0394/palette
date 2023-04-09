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
        if (!(Number.isInteger(userId))) {
            res.status(400).json({status:'error', data:{error:'Invalid User Id'}})
            return
        }
        LibraryService.getPalette(userId)
            .then(response=>{
                res.status(200).json({status:'ok', data:response})
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
    static async getPaletteById(req:Request, res:Response, next:NextFunction) {
        const paletteId = parseInt(req.params.paletteId) //need to check that param is actually integer
        const userId = parseInt(req.body.userId) //need to check that param is actually integer

        LibraryService.getPaletteById(userId, paletteId)
            .then(response=>{
                res.status(200).send({status:'ok', data:response})
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
        const {paletteId, userId, userEmail, palette, name} = req.body
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
        if (paletteId === undefined) {
            res.status(400).send({data:{error:'Missing PaletteId'}, status:'error'})
            return
        }
        if (name === undefined) {
            res.status(400).send({data:{error:'Missing Name'}, status:'error'})
            return
        }
        LibraryService.updatePalette(userId, paletteId, palette, name)
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
        const {userId, userEmail, paletteId} = req.body
        if (userId === undefined) {
            res.status(400).send({data:{error:'Missing userId'}, status:'error'}) 
            return
        }
        if (paletteId === undefined) {
            res.status(400).send({data:{error:'Missing PaletteId'}, status:'error'})
            return
        }

        LibraryService.deletePalette(userId, paletteId)
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