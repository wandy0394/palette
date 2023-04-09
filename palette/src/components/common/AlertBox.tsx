import { useEffect, useState } from "react"
import { AlertAction } from "../../hooks/useEditorAlertReducer"

export type Alert = {
    message:string
    css: 'alert-info' | 'alert-success' | 'alert-warning' | 'alert-error'
}

// export const AlertType = {
//     INFO:'INFO',
//     SUCCESS:'SUCCESS',
//     WARNING:'WARNING',
//     ERROR:'ERROR'
// }
export type AlertType = 'info' | 'success' | 'warning' | 'error' | 'none'
export type AlertMap<T> = {
    [index:string]:T
}

type Props = {
    message:string
    alertType:AlertType,
    visible:boolean,
    hide: () => void
}

export default function AlertBox(props:Props) {
    const {message, alertType, visible, hide} = props
    

    return (
        <div>
        {
            (alertType !== 'none') && visible &&
                <div className='toast z-[100]'>
                    <div className = {`alert alert-${alertType} cursor-pointer`} 
                        onClick={hide}
                    >
                        <span>{message}</span>
                    </div>
                </div>
        }
        </div>
    )
}