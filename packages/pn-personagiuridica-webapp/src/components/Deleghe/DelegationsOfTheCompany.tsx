import { useFormik } from 'formik';
import { isEqual } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Box,
  Checkbox,
  Chip,
  Grid,
  Link,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import {
  ApiErrorWrapper,
  EmptyState,
  KnownSentiment,
  PaginationData,
  Row,
  SmartBody,
  SmartBodyCell,
  SmartBodyRow,
  SmartFilter,
  SmartHeader,
  SmartHeaderCell,
  SmartTable,
  SmartTableData,
  dataRegex,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Autocomplete } from '@pagopa/mui-italia';

import {
  DelegationColumnData,
  DelegationStatus,
  DelegatorsFormFilters,
  GetDelegatorsFilters,
} from '../../models/Deleghe';
import { GroupStatus } from '../../models/groups';
import { DELEGATION_ACTIONS, searchMandatesByDelegate } from '../../redux/delegation/actions';
import { setFilters } from '../../redux/delegation/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utility/delegation.utility';
import DelegationDataSwitch from './DelegationDataSwitch';

const initialEmptyValues: {
  taxId: string;
  groups: Array<{ id: string; name: string }>;
  status: Array<DelegationStatus>;
} = {
  groups: [],
  status: [],
  taxId: '',
};

type Props = {
  clearFiltersHandler: () => void;
  children?: React.ReactNode;
};

const LinkRemoveFilters: React.FC<Props> = ({ children, clearFiltersHandler }) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-first"
    key="remove-filters"
    data-testid="link-remove-filters"
    onClick={clearFiltersHandler}
  >
    {children}
  </Link>
);

const DelegationsOfTheCompany = () => {
  const { t } = useTranslation(['deleghe', 'common']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const firstUpdate = useRef(true);
  const { hasGroup, organization } = useAppSelector((state: RootState) => state.userState.user);
  const filters = useAppSelector((state: RootState) => state.delegationsState.filters);

  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );
  const pagination = useAppSelector((state: RootState) => state.delegationsState.pagination);
  const groups = useAppSelector((state: RootState) => state.delegationsState.groups);
  const statuses = (Object.keys(DelegationStatus) as Array<keyof typeof DelegationStatus>).map(
    (key) => ({ id: DelegationStatus[key], label: t(`deleghe.table.${DelegationStatus[key]}`) })
  );
  const [groupInputValue, setGroupInputValue] = useState('');
  const rows = delegationToItem(delegators) as Array<Row<DelegationColumnData>>;
  // back end return at most the next three pages
  // we have flag moreResult to check if there are more pages
  // the minum number of pages, to have ellipsis in the paginator, is 8
  const totalElements =
    filters.size *
    (pagination.moreResult
      ? pagination.nextPagesKey.length + 5
      : pagination.nextPagesKey.length + 1);

  const smartCfg: Array<SmartTableData<DelegationColumnData>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      tableConfiguration: {
        cellProps: { width: '18%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      tableConfiguration: {
        cellProps: { width: '13%' },
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      tableConfiguration: {
        cellProps: { width: '13%' },
      },
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      tableConfiguration: {
        cellProps: { width: '18%' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'groups',
      label: t('deleghe.table.groups'),
      tableConfiguration: {
        cellProps: { width: '13%' },
      },
      cardConfiguration: {
        hideIfEmpty: true,
        wrapValueInTypography: false,
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      tableConfiguration: {
        cellProps: { width: '20%' },
      },
      cardConfiguration: {
        isCardHeader: true,
        gridProps: {
          xs: 8,
        },
      },
    },
  ];

  if (!hasGroup) {
    /* eslint-disable-next-line functional/immutable-data */
    smartCfg.push({
      id: 'menu',
      label: '',
      tableConfiguration: {
        cellProps: { width: '5%' },
      },
      cardConfiguration: {
        isCardHeader: true,
        gridProps: {
          xs: 4,
        },
        position: 'right',
      },
    });
  }

  const getOptionLabel = (option: { name: string; id: string }) => option.name || '';

  const initialValues: {
    taxId: string;
    groups: Array<{ id: string; name: string }>;
    status: Array<DelegationStatus>;
  } = {
    taxId: filters.taxId || '',
    groups: filters.groups ? groups.filter((group) => filters.groups?.includes(group.id)) : [],
    status: filters.status || [],
  };

  const validationSchema = yup.object({
    taxId: yup
      .string()
      .matches(dataRegex.pIvaAndFiscalCode, t('deleghe.validation.pIvaAndFiscalCode.wrong')),
    groups: yup.array(),
    status: yup.array(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const params = {
        size: filters.size,
        page: 0,
        status: values.status,
        taxId: values.taxId,
        groups: values.groups.map((d) => d.id),
      } as DelegatorsFormFilters;
      dispatch(setFilters(params));
    },
  });

  const clearFiltersHandler = () => {
    const params = {
      size: filters.size,
      page: 0,
    } as DelegatorsFormFilters;
    dispatch(setFilters(params));
  };

  const handleChangeTouched = async (e: any) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleChangeTouchedAutocomplete = async (
    id: string,
    newValue: Array<{ id: string; name: string }>
  ) => {
    await formik.setFieldValue(id, newValue);
    await formik.setFieldTouched(id, true, false);
  };

  const handleChangePage = (paginationData: PaginationData) => {
    dispatch(
      setFilters({
        ...filters,
        size: paginationData.size,
        page: paginationData.page,
      })
    );
  };

  const handleAccept = () => {
    // when a mandate is accepted, we must check if there are filters applied that can change the view
    // for the acceptance, the only filter to check is the status one
    if (
      filters.status &&
      filters.status.length > 0 &&
      !filters.status.includes(DelegationStatus.ACTIVE)
    ) {
      // because the filters applied don't contain the status ACTIVE, we must redo the api call
      getDelegatorsData();
    }
  };

  const handleUpdate = (newGroups: Array<{ id: string; name: string }>) => {
    // when a mandate is updated, we must check if there are filters applied that can change the view
    // for the update, the only filter to check is the groups one
    if (
      filters.groups &&
      filters.groups.length > 0 &&
      // no group must be in common between updated groups and those in filters
      !filters.groups.some((fGroups) => newGroups.findIndex((nGroup) => nGroup.id === fGroups) > -1)
    ) {
      // because the filters applied don't contain the updated groups, we must redo the api call
      getDelegatorsData();
    }
  };

  const getDelegatorsData = () => {
    const delegatorsFilters = {
      size: filters.size,
      nextPageKey: filters.page ? pagination.nextPagesKey[filters.page - 1] : undefined,
      taxId: filters.taxId || undefined,
      groups: filters.groups,
      status: filters.status,
    } as GetDelegatorsFilters;
    void dispatch(searchMandatesByDelegate(delegatorsFilters));
  };

  useEffect(() => {
    if (firstUpdate.current) {
      /* eslint-disable-next-line functional/immutable-data */
      firstUpdate.current = false;
      return;
    }
    getDelegatorsData();
  }, [filters]);

  return (
    <Box data-testid="delegationsOfTheCompany">
      <Typography variant="h6" mb={4}>
        {t('deleghe.delegatorsTitle')}
      </Typography>
      <ApiErrorWrapper
        apiId={DELEGATION_ACTIONS.SEARCH_MANDATES_BY_DELEGATE}
        reloadAction={() => dispatch(searchMandatesByDelegate(filters))}
        mainText={t('deleghe.delegatorsApiErrorMessage')}
      >
        {rows.length > 0 || !isEqual({ size: 10, page: 0 }, filters) ? (
          <SmartTable
            conf={smartCfg}
            data={rows}
            pagination={{
              size: filters.size,
              currentPage: filters.page,
              totalElements,
              numOfDisplayedPages: Math.min(pagination.nextPagesKey.length + 1, 3),
              onChangePage: handleChangePage,
            }}
            emptyState={
              <EmptyState sentimentIcon={KnownSentiment.DISSATISFIED}>
                <Trans
                  i18nKey={'deleghe.no_delegators_after_filters'}
                  ns={'deleghe'}
                  components={[
                    <LinkRemoveFilters
                      key={'remove-filters'}
                      clearFiltersHandler={clearFiltersHandler}
                    />,
                  ]}
                />
              </EmptyState>
            }
            testId="delegations"
          >
            <SmartFilter
              filterLabel={t('button.filtra', { ns: 'common' })}
              cancelLabel={t('button.annulla filtro', { ns: 'common' })}
              onSubmit={formik.handleSubmit}
              onClear={clearFiltersHandler}
              formIsValid={formik.isValid}
              formValues={formik.values}
              initialValues={initialEmptyValues}
            >
              <Grid item xs={12} lg>
                <TextField
                  id="taxId"
                  value={formik.values.taxId}
                  onChange={handleChangeTouched}
                  label={t('deleghe.table.tax-id')}
                  name="taxId"
                  error={formik.touched.taxId && Boolean(formik.errors.taxId)}
                  helperText={formik.touched.taxId && formik.errors.taxId}
                  size="small"
                  fullWidth
                  sx={{ marginBottom: isMobile ? '20px' : '0' }}
                />
              </Grid>
              <Grid item xs={12} lg={3} sx={{ justifyContent: 'space-between' }}>
                <Autocomplete
                  id="groups"
                  options={groups.filter((group) => group.status === GroupStatus.ACTIVE)}
                  multiple
                  getOptionLabel={getOptionLabel}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  label={t('deleghe.table.group')}
                  placeholder={t('deleghe.table.group')}
                  value={formik.values.groups}
                  onChange={(newValue: Array<{ id: string; name: string }>) =>
                    handleChangeTouchedAutocomplete('groups', newValue)
                  }
                  data-testid="groups"
                  inputValue={groupInputValue}
                  onInputChange={(newInputValue) => setGroupInputValue(newInputValue)}
                  noResultsText={t('deleghe.table.no-group-found')}
                  slotProps={{
                    textField: { name: 'groups' },
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={3}>
                <TextField
                  label={t('deleghe.table.status')}
                  id="status"
                  name="status"
                  size="small"
                  fullWidth
                  select
                  SelectProps={{
                    renderValue: (selected: any) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value: any) => {
                          const label = statuses.find((s) => s.id === value)?.label;
                          return <Chip key={value} label={label} />;
                        })}
                      </Box>
                    ),
                    multiple: true,
                  }}
                  variant="outlined"
                  value={formik.values.status}
                  onChange={handleChangeTouched}
                >
                  {statuses.map(({ id, label }) => (
                    <MenuItem key={id} value={id}>
                      <Checkbox checked={formik.values.status.includes(id)} />
                      <ListItemText primary={label} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </SmartFilter>
            <SmartHeader>
              {smartCfg.map((column) => (
                <SmartHeaderCell
                  key={column.id.toString()}
                  columnId={column.id}
                  sortable={column.tableConfiguration.sortable}
                >
                  {column.label}
                </SmartHeaderCell>
              ))}
            </SmartHeader>
            <SmartBody>
              {rows.map((row, index) => (
                <SmartBodyRow key={row.id} index={index} testId="delegationsBodyRow">
                  {smartCfg.map((column) => (
                    <SmartBodyCell
                      key={column.id.toString()}
                      columnId={column.id}
                      tableProps={column.tableConfiguration}
                      cardProps={column.cardConfiguration}
                      isCardHeader={column.cardConfiguration?.isCardHeader}
                      hideInCard={
                        column.cardConfiguration?.hideIfEmpty &&
                        (!row[column.id] || row[column.id].length === 0)
                      }
                    >
                      <DelegationDataSwitch
                        data={row}
                        type={column.id}
                        menuType="delegators"
                        onAccept={handleAccept}
                        onAction={handleUpdate}
                      />
                    </SmartBodyCell>
                  ))}
                </SmartBodyRow>
              ))}
            </SmartBody>
          </SmartTable>
        ) : (
          <EmptyState sentimentIcon={KnownSentiment.NONE}>
            {t('deleghe.no_delegators', { organizationName: organization.name })}
          </EmptyState>
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default DelegationsOfTheCompany;
