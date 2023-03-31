import ErrorBoundary from "./ErrorBoundary"

type Props = {
    value:number
    updateValue:(value:number)=>void
}
export default function ValueSlider(props:Props) {
    const {value, updateValue} = props
    return (
        <ErrorBoundary>
            <div className='flex items-center justify-center rotate-[0deg]'>
                <input type='range' min="0" max="100" value={value} className="range" onChange={e=>updateValue(parseInt(e.target.value))}/>
            </div>
        </ErrorBoundary>
    )
}