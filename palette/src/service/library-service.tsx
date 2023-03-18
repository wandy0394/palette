import { fail, Result } from "../model/common/error";
import { Palette } from "../types/colours";
import { SavedPalette } from "../types/library";

const URL = 'http://192.168.0.128:8080/api/v1/paletteLibrary/paletteLibrary/'



class LibraryService {
    static async #request<TResponse>(url:string, config:RequestInit={}):Promise<TResponse> {
        const response = await fetch(url, config);
        const {data} = await response.json();
        return data as TResponse;
    }

    static async getPalettes(userEmail:string):Promise<SavedPalette[]> {
        let palettes:SavedPalette[] = []
        
        try {
            palettes = await this.#request<SavedPalette[]>(URL+`${1}`)
            console.log(palettes)
        }
        catch (e:unknown) {
            console.log(e)
        }


        return palettes
    }

    static async getPaletteById(userEmail:string, id:number):Promise<SavedPalette|null> {
        let palette:SavedPalette|null = null
        try {
            // const respone:Response = await fetch()
        }
        catch (e:unknown) {
            console.log(e)
        }
        return palette
    }

    static async savePalette(userEmail:string, palette:Palette):Promise<Result<string, string>> {
        let result:Result<string, string> = fail('Unable to save palette')
        let config:RequestInit = {
            method:'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userEmail:userEmail,
                palette:palette
            })
        }
        try {
            result = await this.#request<Result<string, string>>(URL, config)
        }
        catch (e) {
            console.error(e)
        }
        return result
    }
}

//update palette

//post palette

//delete palette
export default LibraryService