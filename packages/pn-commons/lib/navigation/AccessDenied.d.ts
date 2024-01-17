/// <reference types="react" />
declare type Props = {
    isLogged: boolean;
    goToLogin: () => void;
    goToHomePage: () => void;
    message?: string;
    subtitle?: string;
};
declare const AccessDenied: ({ isLogged, goToLogin, goToHomePage, message, subtitle }: Props) => JSX.Element;
export default AccessDenied;
