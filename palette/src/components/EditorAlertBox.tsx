import AlertBox, {AlertMap, Alert, AlertType} from "./common/AlertBox";

// const alertMap:AlertMap<Alert> = {
//     [AlertType.SUCCESS]: {
//         message:'Saved successfully',
//         css:'alert-success'
//     },
//     [AlertType.ERROR]: {
//         message:'An error has occurred',
//         css:'alert-error'
//     },
//     [AlertType.INFO]: {
//         message:'',
//         css:'alert-info'
//     },
//     [AlertType.WARNING]: {
//         message:'An error has occurred',
//         css:'alert-warning'
//     }
// }
type Props = {
    message:string,
    alertType:AlertType,
    visible:boolean,
    hide: () => void
}
export default function EditorAlertBox(props:Props) {
    const {message, alertType, visible, hide} = props
    return (
        <div>
            <AlertBox message={message} alertType={alertType} visible={visible} hide={hide}/>
        </div>
    )
}