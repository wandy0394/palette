import { useEffect, useState } from "react"

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
    setVisible:React.Dispatch<React.SetStateAction<boolean>>
}

export default function AlertBox(props:Props) {
    const {message, alertType, visible, setVisible} = props
    

    return (
        <div>
        {
            (alertType !== 'none') && visible &&
                <div className='toast z-[100]'>
                    <div className = {`alert alert-${alertType} cursor-pointer`} onClick={()=>(setVisible(false))}>
                        <span>{message}</span>
                    </div>
                </div>
        }
        </div>
    )
}