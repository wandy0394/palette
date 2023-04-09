import ErrorBoundary from "../ErrorBoundary";
import LoadingSection from "./LoadingSection";

type Props = {
    children:any
    finishedLoading?:boolean
}



export default function ContentBox(props:Props) {
    const {children, finishedLoading} = props
    return (
        <ErrorBoundary>
            
            <div className='w-full h-full flex flex-col items-center justify-center bg-neutral-700'>
            
                {
                    (finishedLoading !== undefined && finishedLoading === true) && children
                    
                }
                {
                    (finishedLoading !== undefined && finishedLoading === false) && <LoadingSection/>
                }
                {
                    (finishedLoading === undefined) && children
                }
            </div>
        </ErrorBoundary>
    )
}