import { ACTION_TYPES } from "../components/context/AuthContext"
import { useAuthContext } from "./useAuthContext"

export function useLogout() {
    const {dispatch} = useAuthContext()
    function logout() {
        //remove user from storage
        localStorage.removeItem('user')
        if (dispatch) dispatch({type:ACTION_TYPES.LOGOUT, payload:null})
    }

    return {logout}
}