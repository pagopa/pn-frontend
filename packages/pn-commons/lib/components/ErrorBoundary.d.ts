import { Component, ErrorInfo } from 'react';
import { SxProps } from '@mui/material';
type Props = {
    sx?: SxProps;
    printError?: boolean;
    eventTrackingCallback?: (error: Error, errorInfo: ErrorInfo) => void;
    eventTrackingCallbackRefreshPage?: () => void;
};
type State = {
    hasError: boolean;
};
declare class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props);
    static getDerivedStateFromError(): {
        hasError: boolean;
    };
    componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void;
    private handleRefreshPage;
    render(): import("react").ReactNode;
}
export default ErrorBoundary;
