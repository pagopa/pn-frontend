import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Skeleton, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import {
  ApiErrorWrapper,
  CustomPagination,
  EmptyErrorState,
  PaginationData,
  Row,
  SmartBody,
  SmartBodyCell,
  SmartBodyRow,
  SmartHeader,
  SmartHeaderCell,
  SmartTable,
  SmartTableData,
  TitleBox,
  appStateActions,
  calculatePages,
  formatDate,
  useErrors,
} from '@pagopa-pn/pn-commons';
import { IllusMIDataSecurity, MIAlert, MIButton, MIChip, MITextField } from '@pagopa/mui-italia';

import { DelegationStatus, InstitutionRow } from '../models/Institutions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { INSTITUTIONS_ACTIONS, getInstitutions } from '../redux/institutions/actions';
import { resetState, setPagination, setSearch } from '../redux/institutions/reducers';
import { RootState } from '../redux/store';

const delegationStatusChip: Record<
  DelegationStatus,
  { label: string; color: 'success' | 'default' }
> = {
  ACTIVE: { label: 'table.delegation-status.active', color: 'success' },
  REVOKED: { label: 'table.delegation-status.revoked', color: 'default' },
};

const skeletonWidths: Partial<Record<keyof InstitutionRow, number>> = {
  institutionName: 140,
  institutionTaxCode: 160,
  status: 100,
};

const PAGE_SIZES = [10, 20, 50];
const SEARCH_MAX_LENGTH = 250;

const InstitutionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const institutions = useAppSelector((state: RootState) => state.institutionsState.institutions);
  const search = useAppSelector((state: RootState) => state.institutionsState.search);
  const pagination = useAppSelector((state: RootState) => state.institutionsState.pagination);

  const { t } = useTranslation(['enti', 'common']);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const lastRequestId = useRef(0);
  const { hasApiErrors } = useErrors();
  const showSearch =
    hasSearched || (!loading && !hasApiErrors(INSTITUTIONS_ACTIONS.GET_INSTITUTIONS));

  const institutionsColumns: Array<SmartTableData<InstitutionRow>> = [
    {
      id: 'institutionName',
      label: t('table.columns.institution-name'),
      tableConfiguration: {
        cellProps: { width: '33%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'institutionTaxCode',
      label: t('table.columns.tax-code'),
      tableConfiguration: {
        cellProps: { width: '33%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'status',
      label: t('table.columns.delegation'),
      tableConfiguration: {
        cellProps: { width: '34%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
  ];

  const validationSchema = yup.object({
    search: yup
      .string()
      .test('min-length', 'search.min-length', (value) => !value || value.length >= 3)
      .max(SEARCH_MAX_LENGTH, 'search.max-length'),
  });

  const formik = useFormik({
    initialValues: { search },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      setHasSearched(true);
      dispatch(setSearch(values.search));
    },
  });

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleChangePage = (paginationData: PaginationData) => {
    const hasSizeChanged = paginationData.size !== pagination.size;
    dispatch(
      setPagination({
        size: paginationData.size,
        page: hasSizeChanged ? 0 : paginationData.page,
      })
    );
  };

  const fetchInstitutions = useCallback(() => {
    // only the latest request can end the loading, to ignore slower outdated responses
    // eslint-disable-next-line functional/immutable-data
    const requestId = ++lastRequestId.current;
    setLoading(true);
    dispatch(appStateActions.removeErrorsByAction(INSTITUTIONS_ACTIONS.GET_INSTITUTIONS));
    void dispatch(
      getInstitutions({
        search: search || undefined,
        limit: pagination.size,
        lastKey: pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
      })
    ).then(() => {
      if (requestId !== lastRequestId.current) {
        return;
      }
      setLoading(false);
    });
  }, [search, pagination.page, pagination.size]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  useEffect(
    () => () => {
      dispatch(resetState());
    },
    []
  );

  // the api doesn't return the total: pages are known up to the last received lastKey
  const totalElements = pagination.size * (pagination.nextPagesKey.length + 1);
  const pagesToShow: Array<number> = calculatePages(
    pagination.size,
    totalElements,
    Math.min(pagination.nextPagesKey.length + 1, 3),
    pagination.page + 1
  );

  const hideSizeSelector =
    pagination.page === 0 &&
    pagination.nextPagesKey.length === 0 &&
    institutions.items.length <= PAGE_SIZES[0];

  const data: Array<Row<InstitutionRow>> = loading
    ? Array.from(
        { length: pagination.size },
        (_, index) => ({ id: `skeleton-${index}` } as Row<InstitutionRow>)
      )
    : institutions.items.map((institution) => ({
        ...institution,
        id: institution.institutionId,
      }));

  const renderCellContent = (row: Row<InstitutionRow>, columnId: keyof InstitutionRow) => {
    if (loading) {
      return (
        <Skeleton
          variant="rounded"
          width={skeletonWidths[columnId]}
          height={16}
          sx={{ borderRadius: '8px' }}
        />
      );
    }
    if (columnId === 'institutionName') {
      return (
        <Typography component="span" fontWeight={600} sx={{ whiteSpace: 'pre-wrap' }}>
          {row.institutionName}
        </Typography>
      );
    }
    if (columnId === 'institutionTaxCode') {
      return (
        <Typography component="span" variant="monospaced">
          {row.institutionTaxCode}
        </Typography>
      );
    }
    if (columnId === 'status') {
      const chip = delegationStatusChip[row.status];
      return (
        <MIChip
          label={t(chip.label, { date: formatDate(row.statusChangedAt, false) })}
          color={chip.color}
        />
      );
    }
    return String(row[columnId] ?? '');
  };

  const handleSearchBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // keep the focused state when the focus moves to the clear button
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsSearchFocused(false);
    }
  };

  const handleClearSearch = () => {
    void formik.setFieldValue('search', '', false);
    formik.setFieldError('search', undefined);
    searchInputRef.current?.focus();
  };

  return (
    <Box p={3} data-testid="institutionsPage">
      <TitleBox
        title={t('title')}
        subTitle={t('subtitle')}
        variantTitle="h4"
        variantSubTitle="body1"
      />

      <MIAlert severity="info" sx={{ mt: 2 }} data-testid="work-in-progress-alert">
        {t('work-in-progress')}
      </MIAlert>

      {showSearch ? (
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          role="search"
          data-testid="institutionsSearch"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'flex-start' },
            gap: 2,
            mt: 4,
            mb: 3,
          }}
        >
          <Box
            sx={{ flexBasis: { sm: '55%' } }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={handleSearchBlur}
            // prevents the input blur when clicking the clear button
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest('button')) {
                e.preventDefault();
              }
            }}
          >
            <MITextField
              id="search"
              name="search"
              label={t('search.label')}
              inputRef={searchInputRef}
              value={formik.values.search}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.search)}
              helperText={
                formik.errors.search && t(formik.errors.search, { maxLength: SEARCH_MAX_LENGTH })
              }
              onDelete={isSearchFocused && formik.values.search ? handleClearSearch : undefined}
            />
          </Box>
          <MIButton type="submit" variant="outlined" data-testid="searchButton">
            {t('search.button')}
          </MIButton>
        </Box>
      ) : (
        <Box sx={{ mt: 3 }} />
      )}

      <ApiErrorWrapper
        apiId={INSTITUTIONS_ACTIONS.GET_INSTITUTIONS}
        reloadAction={fetchInstitutions}
        customErrorComponent={
          <Box data-testid="institutionsApiError">
            <EmptyErrorState
              variant="error"
              title={t('table.error.title')}
              action={{ label: t('table.error.action'), onClick: fetchInstitutions }}
            />
          </Box>
        }
      >
        <Box data-testid="institutionsList" aria-busy={loading || undefined}>
          <Typography
            role="status"
            aria-live="polite"
            aria-atomic="true"
            sx={{ ...visuallyHidden }}
          >
            {loading ? t('loading', { ns: 'common' }) : ''}
          </Typography>
          <SmartTable
            data={data}
            conf={institutionsColumns}
            testId="institutionsTable"
            slotProps={{ table: { sx: { tableLayout: 'fixed' } } }}
            emptyState={
              search ? (
                <EmptyErrorState
                  variant="error"
                  title={t('table.no-results.title', { search })}
                  description={t('table.no-results.description')}
                />
              ) : (
                <EmptyErrorState
                  variant="empty"
                  icon={<IllusMIDataSecurity size={56} />}
                  title={t('table.empty.title')}
                  description={t('table.empty.description')}
                />
              )
            }
          >
            <SmartHeader>
              {institutionsColumns.map((column) => (
                <SmartHeaderCell
                  key={column.id.toString()}
                  columnId={column.id}
                  sortable={column.tableConfiguration.sortable}
                  cellProps={column.tableConfiguration.cellProps}
                >
                  {column.label}
                </SmartHeaderCell>
              ))}
            </SmartHeader>

            <SmartBody>
              {data.map((row, index) => (
                <SmartBodyRow
                  key={row.id}
                  index={index}
                  testId={loading ? 'institutionsSkeletonRow' : 'institutionsBodyRow'}
                >
                  {institutionsColumns.map((column) => (
                    <SmartBodyCell
                      key={column.id.toString()}
                      columnId={column.id}
                      mode={column.mode}
                      tableProps={column.tableConfiguration}
                      cardProps={column.cardConfiguration}
                      isCardHeader={column.cardConfiguration?.isCardHeader}
                    >
                      {renderCellContent(row, column.id)}
                    </SmartBodyCell>
                  ))}
                </SmartBodyRow>
              ))}
            </SmartBody>
          </SmartTable>
          {!loading && data.length > 0 && (
            <CustomPagination
              paginationData={{
                size: pagination.size,
                page: pagination.page,
                totalElements,
              }}
              onPageRequest={handleChangePage}
              pagesToShow={pagesToShow}
              elementsPerPage={PAGE_SIZES}
              hideSizeSelector={hideSizeSelector}
            />
          )}
        </Box>
      </ApiErrorWrapper>
    </Box>
  );
};

export default InstitutionsPage;
