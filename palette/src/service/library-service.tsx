import { fail, Result, success } from "../model/common/error";
import { Palette } from "../types/colours";
import { SavedPalette } from "../types/library";

const URL = 'http://192.168.0.128:8080/api/v1/paletteLibrary/paletteLibrary/'
// const URL = 'https://app-library-dot-paletto-382422.ts.r.appspot.com/api/v1/paletteLibrary/paletteLibrary/'



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
            throw new Error('Something went wrong: ' + errorMessage.error)
        } 
        catch(e) {
            throw e
        }
    }

    static async getPalettes(userId:number, token:string):Promise<SavedPalette[]> {
        let config:RequestInit = {
            headers: {
                "Content-Type":"application/json",
                'Authorization':'Bearer ' + token
            },
        }
        try {
            let palettes = await this.#request<{data:SavedPalette[]}>(URL+`${userId}`, config)
            return palettes.data
        }
        catch (e:unknown) {
            console.log(e)
            throw (e)
        }
    }

    static async getPaletteById(userId:number, paletteId:string, token:string):Promise<SavedPalette[]|null> {
        //need to either pass userEmail
        let config:RequestInit = {
            headers: {
                "Content-Type":"application/json",
                'Authorization':'Bearer ' + token
            },
        }
        try {
            const response = await this.#request<{data:SavedPalette[]|null}>(URL+`${userId}/${paletteId}`, config)
            return response.data
        }
        catch (e) {
            console.log(e)
            throw(e)
        }
    }

    static async savePalette(userEmail:string, userId:number, palette:Palette, name:string, token:string) {
        let config:RequestInit = {
            method:'POST',
            headers: {
                "Content-Type":"application/json",
                'Authorization':'Bearer ' + token
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

    static async updatePalette(userEmail:string, userId:number, palette:Palette, paletteId:number, name:string, token:string) {
        let config:RequestInit = {
            method:'PUT',
            headers: {
                "Content-Type":"application/json",
                'Authorization':'Bearer ' + token
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

    static async deletePalette(userEmail:string, userId:number, paletteId:number, token:string) {
        let config:RequestInit = {
            method:'DELETE',
            headers: {
                "Content-Type":"application/json",
                'Authorization':'Bearer ' + token
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