import { ACTION_TYPES, AuthContext } from "../components/context/AuthContext";
import {useState} from 'react'
import Authenticator from "../service/authentication-service";
import { useAuthContext } from "./useAuthContext";

export function useRegister() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean | null>(null)
    const {dispatch} = useAuthContext()
    
    async function register (email:string, password:string, name:string) {
        setIsLoading(true)
        setError(null)
        
        const response = await Authenticator.register(email, password, name)
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
    return {register, error, isLoading}
}