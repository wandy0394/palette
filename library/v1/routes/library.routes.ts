import express from 'express'
import LibraryController from "../../controllers/libraryController"

const router = express.Router()

router.route("/paletteLibrary")
    .get(LibraryController.getPalette)
    .post(LibraryController.addPalette)
    .delete(LibraryController.deletePalette)
    .put(LibraryController.updatePalette)

export default router