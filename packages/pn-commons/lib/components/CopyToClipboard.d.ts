/// <reference types="react" />
type Props = {
    /** callback used to retrieve the text to be copied */
    getValue: () => string;
    /** an optional text to be displayed near the "copy to clipboard" icon */
    text?: string;
    tooltipMode?: boolean;
    tooltip?: string;
    tooltipBefore?: string;
    disabled?: boolean;
};
declare const CopyToClipboard: React.FC<Props>;
export default CopyToClipboard;
