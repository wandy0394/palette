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

    static async getPalettes():Promise<SavedPalette[]> {
        let config:RequestInit = {
            headers: {
                "Content-Type":"application/json",
            },
            credentials:"include"
        }
        try {
            let palettes = await this.#request<{data:SavedPalette[]}>(URL, config)
            return palettes.data
        }
        catch (e) {
            console.log(e)
            throw (e)
        }
    }

    static async getPaletteById(paletteId:string):Promise<SavedPalette[]|null> {
        //need to either pass userEmail
        let config:RequestInit = {
            headers: {
                "Content-Type":"application/json",
            },
            credentials:"include"
        }
        try {
            const response = await this.#request<{data:SavedPalette[]|null}>(URL+`${paletteId}`, config)
            return response.data
        }
        catch (e) {
            console.log(e)
            throw(e)
        }
    }

    static async savePalette(palette:Palette, name:string) {
        let config:RequestInit = {
            method:'POST',
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                palette:palette,
                name:name
            }),
            credentials:"include"
        }
        try {
            const response = await this.#request<{response:string, status:string}>(URL, config)
        }
        catch (e) {
            console.error(e)
            throw (e)
        }
    }

    static async updatePalette(palette:Palette, paletteId:number, name:string) {
        let config:RequestInit = {
            method:'PUT',
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                palette:palette,
                paletteId:paletteId,
                name:name
            }),
            credentials:"include"
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

    static async deletePalette(paletteId:number) {
        let config:RequestInit = {
            method:'DELETE',
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                paletteId:paletteId
            }),
            credentials:"include"
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