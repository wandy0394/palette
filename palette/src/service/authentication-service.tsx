import axios from "axios"
import Cookies from 'js-cookie'
// import {useCookies} from 'react-cookie'


const axiosInstance = axios.create({
    baseURL: 'http://192.168.0.128:8080/api/v1/users/',
    // baseURL:'https://app-library-dot-paletto-382422.ts.r.appspot.com/api/v1/users',
    // timeout:3000,
    headers: {
        "Accept" : "*",
        "Content-Type": "application/json",
    },
    withCredentials:true    //need this in the request to store the cookie that is sent by the server in the response
})

export default class Authenticator {

    static async register(email:string, password:string, name:string) {
        const params = {
            email:email,
            password:password,
            name:name
        }
        const response = await axiosInstance
            .post('/signup', params)
            .then((response)=>{
                return response.data
            })
            .catch((error)=>{
                if (error.response) {
                    return {error:error.response.data}
                }
                else if (error.request) {
                    return {error:error.request}
                }
                else {
                    return {error:'An error has occurred.'}
                }
            })
        return response
    }

    static async login(email:string, password:string) {
        const params = {
            email:email,
            password:password,
        }
        const response = await axiosInstance
            .post('/login', params)
            .then((response)=>{
                return response.data
            })
            .catch((error)=>{
                if (error.response) {
                    return {error:error.response.data}
                }
                else if (error.request) {
                    return {error:error.request}
                }
                else {
                    return {error:'An error has occurred.'}
                }
            })
        return response
    }
}