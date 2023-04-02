import ErrorBoundary from "../ErrorBoundary";

export default function ContentBox({children}:any) {
    return (
        <ErrorBoundary>
            <div className='w-full h-full flex flex-col items-center justify-center bg-neutral-700'>
                {children}
            </div>
        </ErrorBoundary>
    )
}