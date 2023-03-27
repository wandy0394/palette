import { ACTION_TYPES } from "../components/context/AuthContext"
import { useAuthContext } from "./useAuthContext"
import useSessionStorage from "./useSessionStorage"

export function useLogout() {
    const {dispatch} = useAuthContext()

    function logout() {
        //remove user from storage
        sessionStorage.removeItem('user')
        if (dispatch) dispatch({type:ACTION_TYPES.LOGOUT, payload:null})
    }

    return {logout}
}