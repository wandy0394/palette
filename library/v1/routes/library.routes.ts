import express from 'express'
import LibraryController from "../../controllers/libraryController"
import requireAuth from '../../middleware/requireAuth'

const router = express.Router()
router.use(requireAuth)

router.route("/paletteLibrary")
    .post(LibraryController.addPalette)
    .delete(LibraryController.deletePalette)
    .put(LibraryController.updatePalette)

router.route("/paletteLibrary/:userId")
    .get(LibraryController.getPalette)

router.route("/paletteLibrary/:userId/:paletteId")
    .get(LibraryController.getPaletteById)    
export default router