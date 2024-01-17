/// <reference types="react" />
import { Column, Item, Sort } from '../../models';
type Props<ColumnId> = {
    /** Table columns */
    columns: Array<Column<ColumnId>>;
    /** Table rows */
    rows: Array<Item>;
    /** Table sort */
    sort?: Sort<ColumnId>;
    /** The function to be invoked if the user change sorting */
    onChangeSorting?: (s: Sort<ColumnId>) => void;
    /** Table title used in aria-label */
    ariaTitle?: string;
    /** Table test id */
    testId?: string;
};
declare function ItemsTable<ColumnId extends string>({ columns, rows, sort, onChangeSorting, ariaTitle, testId, }: Props<ColumnId>): JSX.Element;
export default ItemsTable;
