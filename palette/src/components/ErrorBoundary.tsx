import React from "react";

type Props  = {
    children?:React.ReactNode
}

type State = {
    hasError:boolean
}

class ErrorBoundary extends React.Component<Props, State> {
    public state:State = {
        hasError:false
    }

    public static getDerivedStateFromError(_:Error):State {
        return {hasError:true}
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Uncaught error", error, errorInfo)
    }
    public render() {
        if (this.state.hasError) {
            return 'Oops. Something went wrong'
        }
        return this.props.children
    }
}

export default ErrorBoundary
