import { PropsWithChildren, ReactNode } from 'react';

import { useIsMobile } from '../../hooks';
import { SmartTableAction, SmartTableData } from '../../types/SmartTable';
import { CardAction, CardElement, Column, Item, Sort } from '../../types';
import ItemsCard from './ItemsCard';
import ItemsTable from './ItemsTable';

type Props<ColumnId> = {
  /** smart table configuration */
  conf: Array<SmartTableData<ColumnId>>;
  /** data */
  data: Array<Item>;
  /** current sort value */
  currentSort?: Sort<ColumnId>;
  /** the function to be invoked if the user change sorting */
  onChangeSorting?: (sort: Sort<ColumnId>) => void;
  /* actions */
  actions?: Array<SmartTableAction>;
};

/**
 * SmartTable show table in desktop view and cards in mobile view.
 */
const SmartTable = <ColumnId extends string>({
  conf,
  data,
  currentSort,
  onChangeSorting,
  actions,
}: PropsWithChildren<Props<ColumnId>>) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    const headerElem: Array<CardElement> = [];
    const cardBody: Array<CardElement> = [];
    for (const cfg of conf) {
      /* eslint-disable functional/immutable-data */
      if (cfg.cardConfiguration.position === 'header') {
        headerElem.push({
          id: cfg.id,
          label: cfg.label,
          getLabel: (value: string | number | Array<string | ReactNode>, data?: Item) =>
            cfg.getValue(value, data, true),
          gridProps: cfg.cardConfiguration.gridProps,
        });
      } else if (cfg.cardConfiguration.position === 'body') {
        cardBody.push({
          id: cfg.id,
          label: cfg.label,
          getLabel: (value: string | number | Array<string | ReactNode>, data?: Item) =>
            cfg.getValue(value, data, true),
        });
      }
      /* eslint-enable functional/immutable-data */
    }
    const cardHeader: [CardElement, CardElement | null] = (
      headerElem.length > 2 ? headerElem.slice(0, 2) : headerElem
    ) as [CardElement, CardElement | null];
    const cardActions: Array<CardAction> | undefined = actions
      ?.filter((action) => action.position === 'card' || action.position === 'everywhere')
      .map((action) => ({
        id: action.id,
        component: action.component,
        onClick: action.onClick,
      }));
    return (
      <ItemsCard
        cardHeader={cardHeader}
        cardBody={cardBody}
        cardData={data}
        cardActions={cardActions}
      />
    );
  }

  const columns: Array<Column<ColumnId>> = conf.map((cfg) => ({
    id: cfg.id,
    label: cfg.label,
    width: cfg.tableConfiguration.width,
    align: cfg.tableConfiguration.align,
    sortable: cfg.tableConfiguration.sortable,
    getCellLabel: (value: string | number | Array<string | ReactNode>, data?: Item) =>
      cfg.getValue(value, data, false),
    onClick: cfg.tableConfiguration.onClick,
  }));

  return (
    <ItemsTable
      columns={columns}
      rows={data}
      sort={currentSort}
      onChangeSorting={onChangeSorting}
    />
  );
};

export default SmartTable;
