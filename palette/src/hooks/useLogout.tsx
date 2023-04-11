import { ACTION_TYPES } from "../components/context/AuthContext"
import Authenticator from "../service/authentication-service"
import CacheService from "../service/cache-service"
import { useAuthContext } from "./useAuthContext"

export function useLogout() {
    const {dispatch} = useAuthContext()

    async function logout() {
        //remove user from storage
        // sessionStorage.removeItem('user')
        try {
            const result = await Authenticator.logout()
            if (dispatch) dispatch({type:ACTION_TYPES.LOGOUT, payload:null})
            CacheService.clearCacheAll()
        }
        catch(e) {
            //handle error
        }
    }

    return {logout}
}