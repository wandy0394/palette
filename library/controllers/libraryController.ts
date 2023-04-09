import {Request, Response, NextFunction} from 'express'
import LibraryService from "../services/libraryService"

class LibraryController {
    static async getPalette(req:Request, res:Response, next:NextFunction) {
        const userId = req.body.userId  //id needs to be validated
        if (!userId) {
            res.status(400).send({status:'error', response:'Missing User Id'})
            return
        }
        if (!(Number.isInteger(userId))) {
            res.status(400).send({status:'error', response:'Invalid User Id'})
            return
        }
        LibraryService.getPalette(userId)
            .then(response=>{
                res.status(200).send({status:'ok', data:response})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', error:response.message})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', error:'Internal server error'})
                }
            })
    }
    static async getPaletteById(req:Request, res:Response, next:NextFunction) {
        const paletteId = parseInt(req.params.paletteId) //need to check that param is actually integer
        // const userId = parseInt(req.params.userId) //need to check that param is actually integer
        const userId = req.body.userId

        LibraryService.getPaletteById(userId, paletteId)
            .then(response=>{
                res.status(200).send({status:'ok', data:response})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', error:response.message})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', error:'Internal server error'})
                }
            })
    }
    static async addPalette(req:Request, res:Response, next:NextFunction) {
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
        if (req.body.name === undefined) {
            res.status(400).send({response:'Missing Name', status:'error'})
            return
        }
        LibraryService.addPalette(req.body.userEmail, req.body.userId, req.body.palette, req.body.name)
            .then(response=>{
                res.status(200).send({response:response, status:'ok'})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', error:response.message})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', error:'Internal server error'})
                }
            })
    }

    static updatePalette(req:Request, res:Response, next:NextFunction) {
        
        const paletteId = req.body.paletteId
        const userId = req.body.userId
        const palette = req.body.palette
        const name = req.body.name
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
        if (req.body.paletteId === undefined) {
            res.status(400).send({response:'Missing PaletteId', status:'error'})
            return
        }
        if (req.body.name === undefined) {
            res.status(400).send({response:'Missing Name', status:'error'})
            return
        }
        LibraryService.updatePalette(userId, paletteId, palette, name)
            .then(response=>{
                res.status(200).send({response:response, status:'ok'})
            })
            .catch(response=>{
                if (response instanceof Error) {
                    res.status(500).send({status:'error', error:response.message})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', error:'Internal server error'})
                }
            })
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
                if (response instanceof Error) {
                    res.status(500).send({status:'error', error:response.message})
                }
                else {
                    console.error(response)
                    res.status(500).send({status:'error', error:'Internal server error'})
                }
            })
    }
}

export default LibraryController