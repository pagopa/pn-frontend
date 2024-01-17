/// <reference types="react" />
type Props = {
    initialValues: Array<string>;
    onChange: (values: Array<string>) => void;
    isReadOnly?: boolean;
    hasError?: boolean;
};
declare const _default: import("react").MemoExoticComponent<({ initialValues, isReadOnly, hasError, onChange }: Props) => JSX.Element>;
export default _default;
