/// <reference types="react" />
type Props = {
    onLanguageChanged?: (langCode: string) => void;
    loggedUser?: boolean;
    /** Enables the Terms of Service Link */
    hasTermsOfService?: boolean;
};
declare const Footer: ({ onLanguageChanged, loggedUser, hasTermsOfService }: Props) => JSX.Element;
export default Footer;
