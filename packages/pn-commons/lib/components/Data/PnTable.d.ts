/// <reference types="react" />
type Props = {
    /** Table title used in aria-label */
    ariaTitle?: string;
    /** Table test id */
    testId?: string;
    /** Table children (body and header) */
    children: React.ReactNode;
};
declare const PnTable: React.FC<Props>;
export default PnTable;
