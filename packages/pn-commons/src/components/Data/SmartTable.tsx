import { Children, PropsWithChildren, ReactNode, useMemo, useState } from 'react';
import { Grid } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { sortArray } from '../../utils';
import { SmartTableAction, SmartTableData } from '../../types/SmartTable';
import { CardAction, CardElement, Column, Item, Sort } from '../../types';
import ItemsCard from './ItemsCard';
import ItemsTable from './ItemsTable';
import SmartFilter from './SmartFilter';
import SmartSort from './SmartSort';

type Props<ColumnId> = {
  /** smart table configuration */
  conf: Array<SmartTableData<ColumnId>>;
  /** data */
  data: Array<Item>;
  /** current sort value */
  currentSort?: Sort<ColumnId>;
  /** labels for the sort fields */
  sortLabels?: {
    title: string;
    optionsTitle: string;
    cancel: string;
    asc: string;
    dsc: string;
  };
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
  sortLabels,
  onChangeSorting,
  actions,
  children,
}: PropsWithChildren<Props<ColumnId>>) => {
  const isMobile = useIsMobile();
  const [sort, setSort] = useState<Sort<ColumnId> | undefined>(currentSort);

  const filters = children
    ? Children.toArray(children).filter((child) => child instanceof SmartFilter)
    : [];

  const handleSorting = (newSort: Sort<ColumnId>) => {
    // manage sorting from external
    if (onChangeSorting && newSort) {
      onChangeSorting(newSort);
    } else {
      setSort(newSort);
    }
  };

  const rowData = useMemo(() => {
    if (sort) {
      return sortArray(sort.order, sort.orderBy, data);
    }
    return data;
  }, [sort]);

  if (isMobile) {
    const headerElem: Array<CardElement> = [];
    const cardBody: Array<CardElement> = [];
    const sortFields: Array<{ id: string; label: string }> = [];
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
          notWrappedInTypography: cfg.cardConfiguration.notWrappedInTypography,
        });
      }
      if (cfg.tableConfiguration.sortable) {
        sortFields.push({
          id: cfg.id,
          label: cfg.label,
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
      <>
        <Grid container direction="row" sx={{ mb: 2 }}>
          <Grid item xs={6}></Grid>
          <Grid item xs={6} textAlign="right">
            {sort && sortFields.length > 0 && sortLabels && (
              <SmartSort
                title={sortLabels.title}
                optionsTitle={sortLabels.optionsTitle}
                cancelLabel={sortLabels.cancel}
                ascLabel={sortLabels.asc}
                dscLabel={sortLabels.dsc}
                sortFields={sortFields}
                sort={sort}
                onChangeSorting={handleSorting}
              />
            )}
          </Grid>
        </Grid>
        {filters}
        <ItemsCard
          cardHeader={cardHeader}
          cardBody={cardBody}
          cardData={rowData}
          cardActions={cardActions}
        />
      </>
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
    <>
      {filters}
      <ItemsTable columns={columns} rows={rowData} sort={sort} onChangeSorting={handleSorting} />
    </>
  );
};

export default SmartTable;
