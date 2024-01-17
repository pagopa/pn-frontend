interface IProps {
    callback: () => void;
    count?: number;
    interval?: number;
}
export declare const useMultiEvent: (props: IProps) => (() => void)[];
export {};
