export declare function downloadDocument(url: string): void;
type Props = {
    url?: string;
    clearDownloadAction?: () => void;
};
export declare function useDownloadDocument({ url, clearDownloadAction }: Props): null;
export {};
