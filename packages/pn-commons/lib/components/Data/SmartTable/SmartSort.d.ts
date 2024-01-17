import { PropsWithChildren } from 'react';
import { Sort } from '../../../models';
type Props<T> = {
    /** label to show for the sort button */
    title: string;
    /** label to shoe for the options title */
    optionsTitle: string;
    /** label of the cancel button */
    cancelLabel: string;
    /** localized ascending label */
    ascLabel: string;
    /** localized descending label */
    dscLabel: string;
    /** current sort */
    sort: Sort<T>;
    /** list of available sort fields */
    sortFields: Array<{
        id: keyof T;
        label: string;
    }>;
    /** the function to be invoked if the user change sorting */
    onChangeSorting: (s: Sort<T>) => void;
};
declare const SmartSort: <T>({ title, optionsTitle, cancelLabel, ascLabel, dscLabel, sort, sortFields, onChangeSorting, }: PropsWithChildren<Props<T>>) => JSX.Element;
export default SmartSort;
