import express from 'express'
import LibraryController from "../../controllers/libraryController"

const router = express.Router()

router.route("/paletteLibrary")
    .post(LibraryController.addPalette)
    .delete(LibraryController.deletePalette)
    .put(LibraryController.updatePalette)

router.route("/paletteLibrary/:id")
    .get(LibraryController.getPalette)

export default router