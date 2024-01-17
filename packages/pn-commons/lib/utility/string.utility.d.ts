/**
 * Initial proposal of regex for different kinds of info expressed as strings,
 * the current aim is just to avoid security issues and/or
 * security warnings in the static analysis of the source code.
 * In particular, the one for the phone number could be done *a lot* better.
 * ------------------------
 * Carlos Lombardi, 2022.08.05
 */
export declare const dataRegex: {
    phoneNumber: RegExp;
    phoneNumberWithItalyPrefix: RegExp;
    name: RegExp;
    lettersAndNumbers: RegExp;
    lettersNumbersAndDashs: RegExp;
    noSpaceAtEdges: RegExp;
    htmlPageUrl: RegExp;
    simpleServer: RegExp;
    token: RegExp;
    fiscalCode: RegExp;
    pIva: RegExp;
    pIvaAndFiscalCode: RegExp;
    isoDate: RegExp;
    taxonomyCode: RegExp;
    denomination: RegExp;
    denominationSearch: RegExp;
    noticeCode: RegExp;
    zipCode: RegExp;
    email: RegExp;
};
/**
 * Returns the input fiscal code formatted as required by API.
 * @param  {string} fiscalCode
 * @returns string
 */
export declare function formatFiscalCode(fiscalCode: string): string;
/**
 * Remove dangerous code from a string.
 * @param  {string} srt
 * @returns string
 */
export declare function sanitizeString(srt: string): string;
