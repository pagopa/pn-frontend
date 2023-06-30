import { Children, PropsWithChildren, ReactNode, useMemo, useState } from 'react';
import { Box, Grid } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { calculatePages, sortArray } from '../../utils';
import { SmartTableAction, SmartTableData } from '../../types/SmartTable';
import { CardAction, CardElement, Column, Item, PaginationData, Sort } from '../../types';
import CustomPagination from '../Pagination/CustomPagination';
import EmptyState, { Props as EmptyStateProps } from '../EmptyState';
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
  /** pagination data */
  pagination?: {
    size: number;
    totalElements: number;
    numOfDisplayedPages: number;
    currentPage: number;
    onChangePage: (paginationData: PaginationData) => void;
  };
  /** empty state props */
  emptyStateProps?: EmptyStateProps;
};

function getCardElements<ColumnId extends string>(
  conf: Array<SmartTableData<ColumnId>>,
  actions?: Array<SmartTableAction>
) {
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
        hideIfEmpty: cfg.cardConfiguration.hideIfEmpty,
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

  return { cardHeader, cardBody, cardActions, sortFields };
}

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
  pagination,
  emptyStateProps,
}: PropsWithChildren<Props<ColumnId>>) => {
  const isMobile = useIsMobile();
  const [sort, setSort] = useState<Sort<ColumnId> | undefined>(currentSort);

  const filters = children
    ? Children.toArray(children).filter((child) => (child as JSX.Element).type === SmartFilter)
    : [];

  const pagesToShow = pagination
    ? calculatePages(
        pagination.size,
        pagination.totalElements,
        pagination.numOfDisplayedPages,
        pagination.currentPage + 1
      )
    : undefined;

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
  }, [sort, data]);

  if (isMobile) {
    const { cardHeader, cardBody, cardActions, sortFields } = getCardElements(conf, actions);
    return (
      <>
        <Grid container direction="row" sx={{ mb: 2 }}>
          <Grid item xs={6}>
            {filters}
          </Grid>
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
        {rowData.length > 0 && (
          <ItemsCard
            cardHeader={cardHeader}
            cardBody={cardBody}
            cardData={rowData}
            cardActions={cardActions}
          />
        )}
        {rowData.length > 0 && pagination && (
          <CustomPagination
            paginationData={{
              size: pagination.size,
              page: pagination.currentPage,
              totalElements: pagination.totalElements,
            }}
            onPageRequest={pagination.onChangePage}
            pagesToShow={pagesToShow}
            sx={
              isMobile
                ? {
                    padding: '0',
                    '& .items-per-page-selector button': {
                      paddingLeft: 0,
                      height: '24px',
                    },
                  }
                : { padding: '0' }
            }
          />
        )}
        {rowData.length === 0 && <EmptyState {...emptyStateProps} />}
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
      <Box mb={3}>{filters}</Box>
      {rowData.length > 0 && (
        <ItemsTable columns={columns} rows={rowData} sort={sort} onChangeSorting={handleSorting} />
      )}
      {rowData.length > 0 && pagination && (
        <CustomPagination
          paginationData={{
            size: pagination.size,
            page: pagination.currentPage,
            totalElements: pagination.totalElements,
          }}
          onPageRequest={pagination.onChangePage}
          pagesToShow={pagesToShow}
          sx={
            isMobile
              ? {
                  padding: '0',
                  '& .items-per-page-selector button': {
                    paddingLeft: 0,
                    height: '24px',
                  },
                }
              : { padding: '0' }
          }
        />
      )}
      {rowData.length === 0 && <EmptyState {...emptyStateProps} />}
    </>
  );
};

export default SmartTable;
