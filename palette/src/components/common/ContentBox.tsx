import ErrorBoundary from "../ErrorBoundary";

export default function ContentBox({children}:any) {
    return (
        <ErrorBoundary>
            <div className='w-full flex flex-col items-center justify-center'>
                {children}
            </div>
        </ErrorBoundary>
    )
}