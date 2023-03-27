import { ACTION_TYPES, AuthContext } from "../components/context/AuthContext";
import {useState} from 'react'
import Authenticator from "../service/authentication-service";
import { useAuthContext } from "./useAuthContext";
import useSessionStorage from "./useSessionStorage";
export function useRegister() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | null>(null)
    const {dispatch} = useAuthContext()
    
    async function register (email:string, password:string, name:string) {
        setIsLoading(true)
        setError(null)
        
        const response = await Authenticator.register(email, password, name)
        if (response.error) {
            console.log(response.error)
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
    return {register, error, isLoading}
}