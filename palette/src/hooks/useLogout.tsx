import { ACTION_TYPES } from "../components/context/AuthContext"
import Authenticator from "../service/authentication-service"
import { useAuthContext } from "./useAuthContext"
import useSessionStorage from "./useSessionStorage"

export function useLogout() {
    const {dispatch} = useAuthContext()

    async function logout() {
        //remove user from storage
        // sessionStorage.removeItem('user')
        try {
            const result = await Authenticator.logout()
            if (result.data) {
                if (dispatch) dispatch({type:ACTION_TYPES.LOGOUT, payload:null})
            }
        }
        catch(e) {
            //handle error
        }
    }

    return {logout}
}