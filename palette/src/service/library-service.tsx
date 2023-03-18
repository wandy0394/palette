import { fail, Result, success } from "../model/common/error";
import { Palette } from "../types/colours";
import { SavedPalette } from "../types/library";

const URL = 'http://192.168.0.128:8080/api/v1/paletteLibrary/paletteLibrary/'



class LibraryService {
    static async #request<TResponse>(url:string, config:RequestInit={}):Promise<TResponse> {
        try {
            const response = await fetch(url, config);
            if (response.ok) {
                const data = await response.json();
                return data as TResponse;
            }
            const errorMessage = await response.json()
            console.error(errorMessage)
            throw new Error('Something went wrong: ' + errorMessage.response)
        } 
        catch(e) {
            throw e
        }
    }

    static async getPalettes(userEmail:string, userId:number):Promise<SavedPalette[]> {
        try {
            let palettes = await this.#request<{data:SavedPalette[]}>(URL+`${userId}`)
            return palettes.data
        }
        catch (e:unknown) {
            console.log(e)
            throw (e)
        }
    }

    static async getPaletteById(userEmail:string, userId:number, id:string):Promise<SavedPalette|null> {
        
        try {
            const params = {
                paletteId:id.toString(),
                userEmail:userEmail,
                userId:"1"
            }
            const response = await this.#request<{data:SavedPalette|null}>(URL+`${id}/${userId}`)
            return response.data
        }
        catch (e) {
            console.log(e)
            throw(e)
        }
    }

    static async savePalette(userEmail:string, palette:Palette) {
        let config:RequestInit = {
            method:'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userId:1,
                userEmail:userEmail,
                palette:palette
            })
        }
        try {
            const response = await this.#request<{response:string, status:string}>(URL, config)
        }
        catch (e) {
            console.error(e)
            throw (e)
        }
    }

    static async deletePalette(userEmail:string, paletteId:number) {
        let config:RequestInit = {
            method:'DELETE',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userId:1,
                userEmail:userEmail,
                paletteId:paletteId
            })
        }
        try {
            const response = await this.#request<{response:string, status:string}>(URL, config)
        }
        catch (e) {
            console.error(e)
            throw (e)
        }
    }
}

//update palette

//post palette

//delete palette
export default LibraryService