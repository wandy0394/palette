export default function HarmonySelector(props:{value:any, setValue:Function, harmonies:any}) {
    const {harmonies, value, setValue} = props
    return (
        <select className='select select-primary w-full max-w-xs' value={value} onChange={(e)=>setValue(e.target.value)}>
            <option disabled selected>Choose a colour harmony</option>
            {
                (harmonies !== undefined) &&
                Object.keys(harmonies).map((key)=>{
                    return (
                        <option key={key} id={harmonies[key].id} value={key}>
                            {harmonies[key].label}
                        </option>
                    )
                })
            }
        </select>
    )
}