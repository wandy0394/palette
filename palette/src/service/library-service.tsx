import { Palette } from "../types/colours";
import { SavedPalette } from "../types/library";
import request, { RESPONSE_TYPE, RequestError } from "./request";

const paletteLibraryUrl = (import.meta.env.MODE === 'development')?
                'http://192.168.0.128:8080/api/v1/paletteLibrary/paletteLibrary/':
                'https://app-library-dot-paletto-382422.ts.r.appspot.com/api/v1/paletteLibrary/paletteLibrary/'

const headers = {
  "Content-Type": "application/json",
};

const credentials = "include";

type ResponseObject<T> = {
    status:string,
    data:T
}

class LibraryService {

    static async getPalettes():Promise<SavedPalette[]> {
        let config:RequestInit = {
            headers: headers,
            credentials:credentials
        }
        try {
            let response = await request<ResponseObject<SavedPalette[]>>(paletteLibraryUrl, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
            else {
                throw new RequestError('An error has occurred')
            }
        }
        catch (error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')      
        }
    }

    static async getPaletteById(paletteUUID:string):Promise<SavedPalette[]> {
        let config:RequestInit = {
            headers: headers,
            credentials:credentials
        }
        try {
            const response = await request<ResponseObject<SavedPalette[]>>(paletteLibraryUrl+`${paletteUUID}`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
            else {
                throw new RequestError('An error has occurred')
            }
        }
        catch (error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')        
        }
    }

    static async savePalette(palette:Palette, name:string) {
        let config:RequestInit = {
            method:'POST',
            headers: headers,
            body: JSON.stringify({
                palette:palette,
                name:name
            }),
            credentials:credentials
        }
        try {
            const response = await request<ResponseObject<string>>(paletteLibraryUrl, config)
            if (response.status !== RESPONSE_TYPE.OK) {
                throw new RequestError(response.data, response.status)
            }
        }
        catch (error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async updatePalette(palette:Palette, paletteUUID:string, name:string) {
        let config:RequestInit = {
            method:'PUT',
            headers: headers,
            body: JSON.stringify({
                palette:palette,
                paletteUUID:paletteUUID,
                name:name
            }),
            credentials:credentials
        }
        try {
            const response = await request<ResponseObject<string>>(paletteLibraryUrl, config)
            if (response.status !== RESPONSE_TYPE.OK) {
                throw new RequestError(response.data, response.status)
            }
        }
        catch (error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async deletePalette(paletteUUID:string) {
        let config:RequestInit = {
            method:'DELETE',
            headers: headers,
            body: JSON.stringify({
                paletteUUID:paletteUUID
            }),
            credentials:credentials
        }
        try {
            const response = await request<ResponseObject<string>>(paletteLibraryUrl, config)
            if (response.status !== RESPONSE_TYPE.OK) {
                throw new RequestError(response.data, response.status)
            }
        }
        catch (error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }
}


export default LibraryService