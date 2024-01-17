import { PropsWithChildren } from 'react';
import { PaginationData, Row, SmartTableData, Sort } from '../../models';
type Props<T> = {
    children: React.ReactNode;
    /** smart table configuration */
    conf: Array<SmartTableData<T>>;
    /** data */
    data: Array<Row<T>>;
    /** current sort value */
    currentSort?: Sort<T>;
    /** labels for the sort fields */
    sortLabels?: {
        title: string;
        optionsTitle: string;
        cancel: string;
        asc: string;
        dsc: string;
    };
    /** the function to be invoked if the user change sorting */
    onChangeSorting?: (sort: Sort<T>) => void;
    /** pagination data */
    pagination?: {
        size: number;
        totalElements: number;
        numOfDisplayedPages: number;
        currentPage: number;
        onChangePage: (paginationData: PaginationData) => void;
    };
    /** EmptyState component */
    emptyState?: React.ReactNode;
    /** SmartTable test id */
    testId?: string;
    /** Table title used in aria-label */
    ariaTitle?: string;
};
/**
 * SmartTable show table in desktop view and cards in mobile view.
 */
declare const SmartTable: <T>({ children, conf, data, currentSort, sortLabels, onChangeSorting, pagination, emptyState, testId, ariaTitle, }: PropsWithChildren<Props<T>>) => JSX.Element;
export default SmartTable;
