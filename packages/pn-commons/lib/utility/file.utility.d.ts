export declare const calcBase64String: (file: any) => Promise<string>;
export declare const calcUnit8Array: (file: any) => Promise<Uint8Array>;
export declare const calcSha256String: (file: any) => Promise<{
    hashHex: string;
    hashBase64: string;
}>;
/**
 * Returs the size of a file in format KB, MB or GB
 * @param size size in bytes
 */
export declare const parseFileSize: (size: number, decimals?: number) => string;
