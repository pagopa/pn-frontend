import { PropsWithChildren } from 'react';
import { Sort } from '../../models';
type Props<TSortOption> = {
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
    sort: Sort<TSortOption>;
    /** list of available sort fields */
    sortFields: Array<{
        id: string;
        label: string;
    }>;
    /** the function to be invoked if the user change sorting */
    onChangeSorting: (s: Sort<TSortOption>) => void;
};
declare const SmartSort: <TSortOption extends string>({ title, optionsTitle, cancelLabel, ascLabel, dscLabel, sort, sortFields, onChangeSorting, }: PropsWithChildren<Props<TSortOption>>) => JSX.Element;
export default SmartSort;
