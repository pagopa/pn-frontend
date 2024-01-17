/// <reference types="react" />
import { CardSort, Sort } from '../../models';
type Props<T> = {
    sortFields: Array<CardSort<T>>;
    /** Card sort */
    sort: Sort<T>;
    /** The function to be invoked if the user change sorting */
    onChangeSorting: (s: Sort<T>) => void;
    /** Title of the dialog */
    title: string;
    /** Title of the options section */
    optionsTitle: string;
    /** Label of the cancel button */
    cancelLabel: string;
};
declare const MobileNotificationsSort: <T>({ sortFields, sort, onChangeSorting, title, optionsTitle, cancelLabel, }: Props<T>) => JSX.Element;
export default MobileNotificationsSort;
