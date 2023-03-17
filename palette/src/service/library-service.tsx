import { Palette } from "../types/colours";
import { SavedPalette } from "../types/library";

const URL = 'http://192.168.0.128:8080/api/v1/paletteLibrary/paletteLibrary'
class LibraryService {
    static async getPalettes(userEmail:string):Promise<SavedPalette[]> {
        let palettes:SavedPalette[] = []
        try {
            const response:Response = await fetch(URL)
            const {data} = await response.json()
            console.log(data)
            palettes = data
        }
        catch (e:unknown) {
            console.log(e)
        }


        return palettes
    }
}
//get saved palettes

//update palette

//post palette

//delete palette
export default LibraryService