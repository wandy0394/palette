import {createContext, useReducer, useEffect} from 'react'

export const ACTION_TYPES = {
    LOGIN:'LOGIN',
    LOGOUT:'LOGOUT'
}

type AuthState = {
    user: any
}

type Action = {
    type: string,
    payload:any
}

type ContextType = {
    dispatch: React.Dispatch<Action> | null,
    user:any
}

export const AuthContext = createContext<ContextType>({dispatch:null, user:null})
export const authReducer = (state:AuthState, action:Action) => {
    switch (action.type) {
        case ACTION_TYPES.LOGIN:
            return {user:action.payload}
        case ACTION_TYPES.LOGOUT:
            return {user:null}
        default:
            return state
    }
}
export const AuthContextProvider  = ({children}:any) => {
    const [state, dispatch] = useReducer(authReducer, {
        user:null
    })
    console.log('AuthContext state: ', state)

    let called = false
    useEffect(()=>{
        if (!called) {
            if (localStorage.getItem('user')) {
                const user = JSON.parse(localStorage.getItem('user') as string)
                dispatch({type:ACTION_TYPES.LOGIN, payload:user})
            }
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