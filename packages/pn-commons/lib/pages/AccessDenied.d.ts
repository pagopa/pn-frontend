/// <reference types="react" />
type Props = {
    isLogged: boolean;
    goToLogin: () => void;
    goToHomePage: () => void;
    message?: string;
    subtitle?: string;
};
declare const AccessDenied: React.FC<Props>;
export default AccessDenied;
