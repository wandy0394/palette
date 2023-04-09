import {createContext, useReducer, useEffect} from 'react'
import useSessionStorage from '../../hooks/useSessionStorage'
import Cookies from 'js-cookie'
import Authenticator from '../../service/authentication-service'

export const ACTION_TYPES = {
    LOGIN:'LOGIN',
    LOGOUT:'LOGOUT',
    FINISHED_LOADING:'FINISHED_LOADING'
}

type AuthState = {
    user: any
    finishedLoading:boolean
}

type Action = {
    type: string,
    payload:any
}

type ContextType = {
    dispatch: React.Dispatch<Action> | null,
    user:any
    finishedLoading:boolean
}

export const AuthContext = createContext<ContextType>({dispatch:null, user:null, finishedLoading:false})
export const authReducer = (state:AuthState, action:Action) => {
    switch (action.type) {
        case ACTION_TYPES.LOGIN:
            return {user:action.payload.user, finishedLoading:true}
        case ACTION_TYPES.LOGOUT:
            return {...state, user:null}
        case ACTION_TYPES.FINISHED_LOADING:
            return {...state, finishedLoading:true}
        default:
            return state
    }
}
export const AuthContextProvider  = ({children}:any) => {
    const [state, dispatch] = useReducer(authReducer, {
        user:null,
        finishedLoading:false
    })
    
    console.log('AuthContext state: ', state)

    async function getSession() {
        try {
            const result = await Authenticator.getSession()
            dispatch({type:ACTION_TYPES.LOGIN, payload:{user:result}})
        }
        catch (error) {
            dispatch({type:ACTION_TYPES.FINISHED_LOADING, payload:null})
        }
    }

    let called = false
    useEffect(()=>{
        if (!called) {
            getSession()
        }
        return ()=>{
            called = true
        }
    }, [])
    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}