import request, { RESPONSE_TYPE, RequestError } from "./request";

const authenticationUrl = (import.meta.env.MODE === 'development')?
                            'http://192.168.0.128:8080/api/v1/users':
                            'https://app-library-dot-paletto-382422.ts.r.appspot.com/api/v1/users'

const headers = {
    "Accept" : "*",
    "Content-Type": "application/json",
};
const credentials = "include";

type User = {
    email:string,
    name:string
}

type ResponseObject<T> = {
    status:string,
    data:T
}

export default class Authenticator {

    static async register(email:string, password:string, name:string) {
        const config:RequestInit = {
            method:'POST',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                email:email,
                password:password,
                name:name
            })
        }

        try {
            const response = await request<ResponseObject<User>>(`${authenticationUrl}/signup`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response
            }

        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }        
    }

    static async login(email:string, password:string) {
        const config:RequestInit = {
            method:'POST',
            headers:headers,
            credentials:credentials,
            body: JSON.stringify({
                email:email,
                password:password
            })
        }

        try {
            const response = await request<ResponseObject<User>>(`${authenticationUrl}/login`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }

        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }
    }

    static async logout() {
        const config:RequestInit = {
            method:'GET',
            headers:headers,
            credentials:credentials,
        }
        try {
            const response = await request<ResponseObject<string>>(`${authenticationUrl}/logout`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }     
    }

    static async getSession() {
        const config:RequestInit = {
            method:'GET',
            headers:headers,
            credentials:credentials,
        }
        try {
            const response = await request<ResponseObject<User>>(`${authenticationUrl}/session`, config)
            if (response.status === RESPONSE_TYPE.OK) {
                return response.data
            }
        }
        catch(error) {
            if (error instanceof RequestError || error instanceof Error) throw (error)
            throw new Error('Unknown Error')  
        }  
    }
}