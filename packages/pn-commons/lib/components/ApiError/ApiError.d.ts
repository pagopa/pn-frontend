/// <reference types="react" />
type ApiErrorProps = {
    onClick?: () => void;
    mt?: number;
    mainText?: string;
    apiId?: string;
};
declare const ApiError: React.FC<ApiErrorProps>;
export default ApiError;
