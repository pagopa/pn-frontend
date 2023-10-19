import { Children, PropsWithChildren, ReactNode, useMemo, useState } from 'react';

import { Box, Grid } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { CardAction, CardElement, Column, Item, PaginationData, Sort } from '../../types';
import { SmartTableAction, SmartTableData } from '../../types/SmartTable';
import { calculatePages, sortArray } from '../../utility';
import { IEmptyStateProps } from '../EmptyState';
import CustomPagination from '../Pagination/CustomPagination';
import ItemsCard from './ItemsCard';
import ItemsCardAction from './ItemsCard/ItemsCardAction';
import ItemsCardActions from './ItemsCard/ItemsCardActions';
import ItemsCardBody from './ItemsCard/ItemsCardBody';
import ItemsCardContent from './ItemsCard/ItemsCardContent';
import ItemsCardContents from './ItemsCard/ItemsCardContents';
import ItemsCardHeader from './ItemsCard/ItemsCardHeader';
import ItemsCardHeaderTitle from './ItemsCard/ItemsCardHeaderTitle';
import ItemsTable from './ItemsTable';
import ItemsTableBody from './ItemsTable/ItemsTableBody';
import ItemsTableBodyCell from './ItemsTable/ItemsTableBodyCell';
import ItemsTableBodyRow from './ItemsTable/ItemsTableBodyRow';
import ItemsTableHeader from './ItemsTable/ItemsTableHeader';
import ItemsTableHeaderCell from './ItemsTable/ItemsTableHeaderCell';
import SmartFilter, { ISmartFilterProps } from './SmartFilter';
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
  /** EmptyState component */
  emptyState?: React.ReactElement<IEmptyStateProps>;
  /** SmartTable test id */
  testId?: string;
  /** Table title used in aria-label */
  ariaTitle?: string;
  children?: React.ReactElement<ISmartFilterProps<string>>;
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
  emptyState,
  testId,
  ariaTitle,
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
          <ItemsCard>
            {rowData.map((data) => (
              <ItemsCardBody key={data.id}>
                <ItemsCardHeader>
                  <ItemsCardHeaderTitle
                    cardHeader={cardHeader}
                    item={data}
                    headerGridProps={{
                      direction: { xs: 'row', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                    }}
                  />
                </ItemsCardHeader>
                <ItemsCardContents>
                  {cardBody.map((body) => (
                    <ItemsCardContent key={body.id} body={body}>
                      {body.getLabel(data[body.id], data)}
                    </ItemsCardContent>
                  ))}
                </ItemsCardContents>
                <ItemsCardActions>
                  {cardActions &&
                    cardActions.map((action) => (
                      <ItemsCardAction
                        testId="cardAction"
                        key={action.id}
                        handleOnClick={() => action.onClick(data)}
                      >
                        {action.component}
                      </ItemsCardAction>
                    ))}
                </ItemsCardActions>
              </ItemsCardBody>
            ))}
          </ItemsCard>
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
        {rowData.length === 0 && emptyState}
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
        <ItemsTable testId={testId} ariaTitle={ariaTitle}>
          <ItemsTableHeader>
            {columns.map((column) => (
              <ItemsTableHeaderCell
                key={column.id}
                sort={sort}
                columnId={column.id}
                sortable={column.sortable}
                handleClick={handleSorting}
              >
                {column.label}
              </ItemsTableHeaderCell>
            ))}
          </ItemsTableHeader>
          <ItemsTableBody testId="tableBody">
            {rowData.map((row, index) => (
              <ItemsTableBodyRow key={row.id} testId={testId} index={index}>
                {columns.map((column) => (
                  <ItemsTableBodyCell
                    disableAccessibility={column.disableAccessibility}
                    key={column.id}
                    testId="tableBodyCell"
                    onClick={column.onClick ? () => column.onClick!(row, column) : undefined}
                    cellProps={{
                      width: column.width,
                      align: column.align,
                      cursor: column.onClick ? 'pointer' : 'auto',
                    }}
                  >
                    {column.getCellLabel(row[column.id as keyof Item], row)}
                  </ItemsTableBodyCell>
                ))}
              </ItemsTableBodyRow>
            ))}
          </ItemsTableBody>
        </ItemsTable>
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
      {rowData.length === 0 && emptyState}
    </>
  );
};

export default SmartTable;
