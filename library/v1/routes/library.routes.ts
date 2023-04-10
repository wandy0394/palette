import express from 'express'
import LibraryController from "../../controllers/libraryController"
import requireAuth from '../../middleware/requireAuth'
import requireAuthCookie from '../../middleware/requireAuthCookie'

const router = express.Router()
router.use(requireAuthCookie)

router.route("/paletteLibrary")
    .post(LibraryController.addPalette)
    .delete(LibraryController.deletePalette)
    .put(LibraryController.updatePalette)
    .get(LibraryController.getPalette)

router.route("/paletteLibrary/:paletteUUID")
    .get(LibraryController.getPaletteByUUID)    
export default router