import { ACTION_TYPES, AuthContext } from "../components/context/AuthContext"
import {useState} from 'react'
import Authenticator from "../service/authentication-service";
import { useAuthContext } from "./useAuthContext";
import useSessionStorage from "./useSessionStorage";

export function useLogin() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | null>(null)
    const {dispatch} = useAuthContext()
    
    async function login (email:string, password:string) {
        setIsLoading(true)
        setError(null)
        
        const response = await Authenticator.login(email, password)
        if (response.error) {
            setIsLoading(false)
            setError(response.error.response)
            throw Error(response.error.response)
        }
        else {
            //store user in session storage
            sessionStorage.setItem('user', JSON.stringify(response))
            //update auth context
            if (dispatch) dispatch({type:ACTION_TYPES.LOGIN, payload:response})
            setIsLoading(false)
        }
    }
    return {login, error, isLoading}
}