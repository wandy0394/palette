import { useEffect, useState , Dispatch, SetStateAction} from "react";


export default function useSessionStorage<T>(key:string, initialValue:T):[T, React.Dispatch<React.SetStateAction<T>>] {
    
    function setInitialValue():T {
        let item = sessionStorage.getItem(key)
        return item ? JSON.parse(item) as T : initialValue
    }
    
    const [item, setItem] = useState<T>(setInitialValue)

    useEffect(()=>{
        console.log('set')
        try {
            console.log(key)
            console.log(item)
            sessionStorage.setItem(key, JSON.stringify(item))
        }
        catch {
            //handle error here
            console.log('error')
        }
    }, [item, key])


    return [item, setItem]

}