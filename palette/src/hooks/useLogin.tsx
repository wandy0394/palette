import { ACTION_TYPES, AuthContext } from "../components/context/AuthContext"
import {useState} from 'react'
import Authenticator from "../service/authentication-service";
import { useAuthContext } from "./useAuthContext";

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
            setError(response.error.error)
            throw Error(response.error.error)
        }
        else {
            //update auth context
            if (dispatch) dispatch({type:ACTION_TYPES.LOGIN, payload:response})
            setIsLoading(false)
        }
    }
    return {login, error, isLoading}
}