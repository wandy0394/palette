import LibraryDAO from "../database/libraryDAO";

class LibraryService {
    static getPalette(userEmail:string) {
        const data = LibraryDAO.getPalette(userEmail)
        return data
    }

    static updatePalette(userEmail:string) {

    }

    static deletePalette(userEmail:string) {

    }

    static addPalette(userEmail:string) {

    }
}

export default LibraryService