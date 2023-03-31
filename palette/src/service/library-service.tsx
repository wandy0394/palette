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

    static async getPalettes(userId:number):Promise<SavedPalette[]> {
        try {
            let palettes = await this.#request<{data:SavedPalette[]}>(URL+`${userId}`)
            return palettes.data
        }
        catch (e:unknown) {
            console.log(e)
            throw (e)
        }
    }

    static async getPaletteById(userId:number, paletteId:string):Promise<SavedPalette[]|null> {
        //need to either pass userEmail
        try {
            const response = await this.#request<{data:SavedPalette[]|null}>(URL+`${userId}/${paletteId}`)
            return response.data
        }
        catch (e) {
            console.log(e)
            throw(e)
        }
    }

    static async savePalette(userEmail:string, userId:number, palette:Palette, name:string) {
        let config:RequestInit = {
            method:'POST',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userId:userId,
                userEmail:userEmail,
                palette:palette,
                name:name
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

    static async updatePalette(userEmail:string, userId:number, palette:Palette, paletteId:number, name:string) {
        let config:RequestInit = {
            method:'PUT',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userId:userId,
                userEmail:userEmail,
                palette:palette,
                paletteId:paletteId,
                name:name
            })
        }
        try {
            const response = await this.#request<{response:string, status:string}>(URL, config)
            console.log(response)
        }
        catch (e) {
            console.error(e)
            throw (e)
        }
    }

    static async deletePalette(userEmail:string, userId:number, paletteId:number) {
        let config:RequestInit = {
            method:'DELETE',
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                userId:userId,
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