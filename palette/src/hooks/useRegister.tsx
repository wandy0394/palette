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

        try {
            const response = await Authenticator.register(email, password, name)
            if (dispatch) dispatch({type:ACTION_TYPES.LOGIN, payload:response})
            setIsLoading(false)
        }
        catch (error) {
            setIsLoading(false)
            if (error instanceof Error) {
                setError(error.message)
                throw error
            }
            console.error(error)
            setError('Unknown Error')
            throw new Error('Unknown Error')
        }
    }
    return {register, error, isLoading}
}