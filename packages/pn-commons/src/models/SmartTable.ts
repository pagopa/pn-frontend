import { CardElement } from './PnCard';
import { Column } from './PnTable';

/**
 * @typedef CardConfiguration configuration for the card view
 * @prop {boolean} isCardHeader if true puts the element in the card header
 * @prop {boolean} hideIfEmpty if true hide the element when its values is empty
 */
interface CardConfiguration<T> extends CardElement<T> {
  hideIfEmpty?: boolean;
  isCardHeader?: boolean;
}

/**
 * @typedef SmartTableData SmartTable data structure
 * @prop {ColumnId} id id of the data
 * @prop {string} label label of the field
 * @prop {Column} tableConfiguration field configuration for the table view
 * @prop {CardConfiguration} cardConfiguration field configuration for the card view
 */
export interface SmartTableData<T> {
  id: keyof T;
  label: string;
  tableConfiguration: Omit<Column<T>, 'id' | 'label'>;
  cardConfiguration?: Omit<CardConfiguration<T>, 'id' | 'label'>;
}
