import express from 'express'
import LibraryController from "../controllers/library.controller"

const router = express.Router()

router.route("/library")
    .get(LibraryController.apiGetPalette)
    .post(LibraryController.apiAddPalette)
    .delete(LibraryController.apiDeletePalette)
    .put(LibraryController.apiUpdatePalette)

export default router