import { Children, PropsWithChildren, cloneElement, useMemo, useState } from 'react';

import { Box, Grid } from '@mui/material';

import { useIsMobile } from '../../hooks';
import {
  CardAction,
  CardElement,
  Column,
  PaginationData,
  Row,
  SmartTableData,
  Sort,
} from '../../models';
import { SmartTableAction } from '../../models/SmartTable';
import { calculatePages, sortArray } from '../../utility';
import CustomPagination from '../Pagination/CustomPagination';
import PnCard from './PnCard/PnCard';
import PnCardActions from './PnCard/PnCardActions';
import PnCardContent from './PnCard/PnCardContent';
import PnCardContentItem from './PnCard/PnCardContentItem';
import PnCardHeader from './PnCard/PnCardHeader';
import PnCardHeaderTitle from './PnCard/PnCardHeaderItem';
import PnCardsList from './PnCardsList';
import PnTable from './PnTable';
import PnTableBody from './PnTable/PnTableBody';
import PnTableBodyCell from './PnTable/PnTableBodyCell';
import PnTableBodyRow from './PnTable/PnTableBodyRow';
import PnTableHeader from './PnTable/PnTableHeader';
import PnTableHeaderCell from './PnTable/PnTableHeaderCell';
import SmartFilter from './SmartFilter';
import SmartSort from './SmartSort';

type Props<T> = {
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
  /* actions */
  actions?: Array<SmartTableAction<T>>;
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

function getCardElements<T>(conf: Array<SmartTableData<T>>, actions?: Array<SmartTableAction<T>>) {
  const headerElem: Array<CardElement<T>> = [];
  const cardBody: Array<CardElement<T>> = [];
  const sortFields: Array<{ id: keyof T; label: string }> = [];
  for (const cfg of conf) {
    /* eslint-disable functional/immutable-data */
    if (cfg.cardConfiguration.position === 'header') {
      headerElem.push({
        id: cfg.id,
        label: cfg.label,
        getLabel: (value: Row<T>[keyof T], data?: Row<T>) => cfg.getValue(value, data, true),
        gridProps: cfg.cardConfiguration.gridProps,
        position: cfg.cardConfiguration.position,
      });
    } else if (cfg.cardConfiguration.position === 'body') {
      cardBody.push({
        id: cfg.id,
        label: cfg.label,
        getLabel: (value: Row<T>[keyof T], data?: Row<T>) => cfg.getValue(value, data, true),
        wrapValueInTypography: cfg.cardConfiguration.wrapValueInTypography,
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
  const cardHeader: [CardElement<T>, CardElement<T> | null] = (
    headerElem.length > 2 ? headerElem.slice(0, 2) : headerElem
  ) as [CardElement<T>, CardElement<T> | null];

  const cardActions: Array<CardAction<T>> | undefined = actions
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
const SmartTable = <T,>({
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
}: PropsWithChildren<Props<T>>) => {
  const isMobile = useIsMobile();
  const [sort, setSort] = useState<Sort<T> | undefined>(currentSort);

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

  const handleSorting = (newSort: Sort<T>) => {
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
          <PnCardsList>
            {rowData.map((data) => (
              <PnCard key={data.id}>
                <PnCardHeader>
                  <PnCardHeaderTitle
                    key={cardHeader[0].id.toString()}
                    gridProps={cardHeader[0].gridProps}
                    position="left"
                  >
                    {cardHeader[0].getLabel!(data[cardHeader[0].id], data)}
                  </PnCardHeaderTitle>
                  {cardHeader[1] && (
                    <PnCardHeaderTitle
                      key={cardHeader[1].id.toString()}
                      gridProps={cardHeader[1].gridProps}
                      position="right"
                    >
                      {cardHeader[1].getLabel!(data[cardHeader[1].id], data)}
                    </PnCardHeaderTitle>
                  )}
                </PnCardHeader>
                <PnCardContent>
                  {cardBody.map((body) => (
                    <PnCardContentItem key={body.id.toString()} label={body.label}>
                      {body.getLabel!(data[body.id], data)}
                    </PnCardContentItem>
                  ))}
                </PnCardContent>
                <PnCardActions>
                  {cardActions &&
                    cardActions.map((action) =>
                      cloneElement(action.component, {
                        onClick: () => action.onClick(data),
                      })
                    )}
                </PnCardActions>
              </PnCard>
            ))}
          </PnCardsList>
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

  const columns: Array<Column<T>> = conf.map((cfg) => ({
    id: cfg.id,
    label: cfg.label,
    width: cfg.tableConfiguration.width,
    align: cfg.tableConfiguration.align,
    sortable: cfg.tableConfiguration.sortable,
    getCellLabel: (value: Row<T>[keyof T], data?: Row<T>) => cfg.getValue(value, data, false),
    onClick: cfg.tableConfiguration.onClick,
  }));

  return (
    <>
      <Box mb={3}>{filters}</Box>
      {rowData.length > 0 && (
        <PnTable testId={testId} ariaTitle={ariaTitle}>
          <PnTableHeader>
            {columns.map((column) => (
              <PnTableHeaderCell
                key={column.id.toString()}
                sort={sort}
                columnId={column.id}
                sortable={column.sortable}
                handleClick={handleSorting}
              >
                {column.label}
              </PnTableHeaderCell>
            ))}
          </PnTableHeader>
          <PnTableBody testId="tableBody">
            {rowData.map((row, index) => (
              <PnTableBodyRow key={row.id} testId={testId} index={index}>
                {columns.map((column) => (
                  <PnTableBodyCell
                    key={column.id.toString()}
                    testId="tableBodyCell"
                    onClick={column.onClick ? () => column.onClick!(row, column) : undefined}
                    cellProps={{
                      width: column.width,
                      align: column.align,
                      cursor: column.onClick ? 'pointer' : 'auto',
                    }}
                  >
                    {column.getCellLabel!(row[column.id], row)}
                  </PnTableBodyCell>
                ))}
              </PnTableBodyRow>
            ))}
          </PnTableBody>
        </PnTable>
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
