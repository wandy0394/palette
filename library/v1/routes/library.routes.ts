import express from 'express'
import LibraryController from "../../controllers/libraryController"

const router = express.Router()

router.route("/paletteLibrary")
    .post(LibraryController.addPalette)
    .delete(LibraryController.deletePalette)
    .put(LibraryController.updatePalette)

router.route("/paletteLibrary/:userId")
    .get(LibraryController.getPalette)

router.route("/paletteLibrary/:userId/:paletteId")
    .get(LibraryController.getPaletteById)    
export default router