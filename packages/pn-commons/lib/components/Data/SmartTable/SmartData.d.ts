/// <reference types="react" />
import { Sort } from '../../../models';
type Props<T> = {
    children: React.ReactNode;
    /** SmartTable test id */
    testId?: string;
    /** Table title used in aria-label */
    ariaTitle?: string;
    /** current sort value */
    sort?: Sort<T>;
    /** the function to be invoked if the user change sorting */
    onChangeSorting?: (sort: Sort<T>) => void;
};
declare const SmartData: <T>({ children, testId, ariaTitle, sort, onChangeSorting }: Props<T>) => JSX.Element;
export default SmartData;
