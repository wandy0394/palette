import { useParams } from "react-router-dom"
import Editor from "./editor"

export default function Updater() {
    //need to check that the logged in user has access to this id
    const {id} = useParams()
    return (
        <Editor />
    )
}