import { Children, PropsWithChildren } from 'react';

import { Box, Grid } from '@mui/material';

import { useIsMobile } from '../../hooks/useIsMobile';
import { PaginationData } from '../../models/Pagination';
import { Row, SlotProps, Sort } from '../../models/PnTable';
import { SmartTableData } from '../../models/SmartTable';
import checkChildren from '../../utility/children.utility';
import { calculatePages } from '../../utility/pagination.utility';
import CustomPagination from '../Pagination/CustomPagination';
import SmartBody from './SmartTable/SmartBody';
import SmartData from './SmartTable/SmartData';
import SmartFilter from './SmartTable/SmartFilter';
import SmartHeader from './SmartTable/SmartHeader';
import SmartSort from './SmartTable/SmartSort';

function getSortFields<T>(conf: Array<SmartTableData<T>>) {
  const sortFields: Array<{ id: keyof T; label: string }> = [];
  for (const cfg of conf) {
    if (cfg.tableConfiguration.sortable) {
      // eslint-disable-next-line functional/immutable-data
      sortFields.push({
        id: cfg.id,
        label: cfg.label,
      });
    }
  }
  return { sortFields };
}

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
  /** Components props */
  slotProps?: SlotProps;
};

/**
 * SmartTable show table in desktop view and cards in mobile view.
 */
const SmartTable = <T,>({
  children,
  conf,
  data,
  currentSort,
  sortLabels,
  onChangeSorting = () => {},
  pagination,
  emptyState,
  testId,
  ariaTitle,
  slotProps,
}: PropsWithChildren<Props<T>>) => {
  const isMobile = useIsMobile();

  checkChildren(
    children,
    [
      { cmp: SmartFilter, maxCount: 1 },
      { cmp: SmartHeader, required: true, maxCount: 1 },
      { cmp: SmartBody, required: true, maxCount: 1 },
    ],
    'SmartTable'
  );

  const filters = children
    ? Children.toArray(children).find((child) => (child as JSX.Element).type === SmartFilter)
    : null;

  const pagesToShow = pagination
    ? calculatePages(
        pagination.size,
        pagination.totalElements,
        pagination.numOfDisplayedPages,
        pagination.currentPage + 1
      )
    : undefined;

  if (isMobile) {
    const { sortFields } = getSortFields(conf);

    return (
      <>
        <Grid container direction="row" sx={{ mb: 2 }}>
          <Grid item xs={6}>
            {filters}
          </Grid>
          <Grid item xs={6} textAlign="right">
            {currentSort && sortFields.length > 0 && sortLabels && (
              <SmartSort
                title={sortLabels.title}
                optionsTitle={sortLabels.optionsTitle}
                cancelLabel={sortLabels.cancel}
                ascLabel={sortLabels.asc}
                dscLabel={sortLabels.dsc}
                sortFields={sortFields}
                sort={currentSort}
                onChangeSorting={onChangeSorting}
              />
            )}
          </Grid>
        </Grid>
        {data.length > 0 && (
          <SmartData
            ariaTitle={ariaTitle}
            testId={testId}
            sort={currentSort}
            onChangeSorting={onChangeSorting}
            slotProps={slotProps}
          >
            {children}
          </SmartData>
        )}
        {data.length > 0 && pagination && (
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
        {data.length === 0 && emptyState}
      </>
    );
  }
  return (
    <>
      <Box mb={3}>{filters}</Box>
      {data.length > 0 && (
        <SmartData
          ariaTitle={ariaTitle}
          testId={testId}
          sort={currentSort}
          onChangeSorting={onChangeSorting}
          slotProps={slotProps}
        >
          {children}
        </SmartData>
      )}
      {data.length > 0 && pagination && (
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
      {data.length === 0 && emptyState}
    </>
  );
};

export default SmartTable;
