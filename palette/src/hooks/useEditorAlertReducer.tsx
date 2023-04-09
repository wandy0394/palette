import { useReducer } from 'react'
import { AlertType } from '../components/common/AlertBox'


export type AlertState = {
    message:string,
    alertType:AlertType,
    visible:boolean
}

export type AlertAction = {
    type:AlertType | 'hide'
    payload: {
        message:string,
        visibile:boolean
    }
}

export default function useEditorAlertReducer(initialState:AlertState):[AlertState, React.Dispatch<AlertAction>] {
    
    const [state, dispatch] = useReducer(reducer, initialState)

    function reducer(state:AlertState, action:AlertAction):AlertState {
        const {type, payload} = action

        if (type === 'error' || type === 'info' || type === 'none' || type === 'success' || type === 'warning')
            return {message:payload.message, alertType:type, visible:payload.visibile}
        if (type === 'hide')
            return {...state, visible:false}
        return state
    }

    return [state, dispatch]
}