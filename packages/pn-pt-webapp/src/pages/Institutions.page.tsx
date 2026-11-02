import { useFormik } from 'formik';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Typography } from '@mui/material';
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
  calculatePages,
  formatDate,
} from '@pagopa-pn/pn-commons';
import { MIAlert, MIButton, MIChip, MITextField } from '@pagopa/mui-italia';

import { DelegationStatus, InstitutionRow } from '../models/Institutions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { INSTITUTIONS_ACTIONS, getInstitutions } from '../redux/institutions/actions';
import { setPagination, setSearch } from '../redux/institutions/reducers';
import { RootState } from '../redux/store';

const delegationStatusChip: Record<
  DelegationStatus,
  { label: string; color: 'success' | 'default' }
> = {
  ACTIVE: { label: 'table.delegation-status.active', color: 'success' },
  REVOKED: { label: 'table.delegation-status.revoked', color: 'default' },
};

const InstitutionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const institutions = useAppSelector((state: RootState) => state.institutionsState.institutions);
  const search = useAppSelector((state: RootState) => state.institutionsState.search);
  const pagination = useAppSelector((state: RootState) => state.institutionsState.pagination);

  const { t } = useTranslation('enti');

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
    search: yup.string().trim().required(t('search.min-length')).min(3, t('search.min-length')),
  });

  const formik = useFormik({
    initialValues: { search },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      dispatch(setSearch(values.search.trim()));
    },
  });

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
    void dispatch(
      getInstitutions({
        search: search || undefined,
        limit: pagination.size,
        lastKey: pagination.page === 0 ? undefined : pagination.nextPagesKey[pagination.page - 1],
      })
    );
  }, [search, pagination.page, pagination.size]);

  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions]);

  // the api doesn't return the total: pages are known up to the last received lastKey
  const totalElements = pagination.size * (pagination.nextPagesKey.length + 1);
  const pagesToShow: Array<number> = calculatePages(
    pagination.size,
    totalElements,
    Math.min(pagination.nextPagesKey.length + 1, 3),
    pagination.page + 1
  );

  const data: Array<Row<InstitutionRow>> = institutions.items.map((institution) => ({
    ...institution,
    id: institution.institutionId,
  }));

  const renderCellContent = (row: Row<InstitutionRow>, columnId: keyof InstitutionRow) => {
    if (columnId === 'institutionName') {
      return (
        <Typography component="span" fontWeight={600}>
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
        <MITextField
          id="search"
          name="search"
          label={t('search.label')}
          required
          value={formik.values.search}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.search)}
          helperText={formik.errors.search}
          sx={{ flexBasis: { sm: '55%' } }}
        />
        <MIButton type="submit" variant="outlined" data-testid="searchButton">
          {t('search.button')}
        </MIButton>
      </Box>

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
        <Box data-testid="institutionsList">
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
                  variant="empty-institution"
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
                <SmartBodyRow key={row.id} index={index} testId="institutionsBodyRow">
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
          {data.length > 0 && (
            <CustomPagination
              paginationData={{
                size: pagination.size,
                page: pagination.page,
                totalElements,
              }}
              onPageRequest={handleChangePage}
              pagesToShow={pagesToShow}
            />
          )}
        </Box>
      </ApiErrorWrapper>
    </Box>
  );
};

export default InstitutionsPage;
