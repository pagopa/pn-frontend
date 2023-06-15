import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AutocompleteRenderOptionState,
  Box,
  Checkbox,
  Chip,
  Grid,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {
  ApiErrorWrapper,
  CustomTagGroup,
  EmptyState,
  Item,
  KnownSentiment,
  PaginationData,
  PnAutocomplete,
  SmartFilter,
  SmartTable,
  SmartTableData,
  dataRegex,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Tag } from '@pagopa/mui-italia';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { GroupStatus } from '../../models/groups';
import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import { setFilters } from '../../redux/delegation/reducers';
import delegationToItem from '../../utils/delegation.utility';
import { getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import {
  DelegationStatus,
  DelegatorsColumn,
  DelegatorsFormFilters,
  GetDelegatorsFilters,
} from '../../models/Deleghe';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const initialEmptyValues: {
  taxId: string;
  groups: Array<{ id: string; name: string }>;
  status: Array<DelegationStatus>;
} = {
  groups: [],
  status: [],
  taxId: '',
};

const DelegationsOfTheCompany = () => {
  const { t } = useTranslation(['deleghe', 'common']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const firstUpdate = useRef(true);
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
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
  const rows: Array<Item> = delegationToItem(delegators);
  // back end return at most the next three pages
  // we have flag moreResult to check if there are more pages
  // the minum number of pages, to have ellipsis in the paginator, is 8
  const totalElements =
    filters.size *
    (pagination.moreResult
      ? pagination.nextPagesKey.length + 5
      : pagination.nextPagesKey.length + 1);

  const smartCfg: Array<SmartTableData<DelegatorsColumn>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      getValue(value: string) {
        return <Typography fontWeight="bold">{value}</Typography>;
      },
      tableConfiguration: {
        width: '18%',
      },
      cardConfiguration: {
        position: 'body',
        notWrappedInTypography: true,
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      getValue(value: string) {
        return value;
      },
      tableConfiguration: {
        width: '13%',
      },
      cardConfiguration: {
        position: 'body',
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      getValue(value: string) {
        return value;
      },
      tableConfiguration: {
        width: '13%',
      },
      cardConfiguration: {
        position: 'body',
      },
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      getValue(value: Array<string>) {
        return <OrganizationsList organizations={value} visibleItems={3} />;
      },
      tableConfiguration: {
        width: '18%',
      },
      cardConfiguration: {
        position: 'body',
        notWrappedInTypography: true,
      },
    },
    {
      id: 'groups',
      label: t('deleghe.table.groups'),
      getValue(value: Array<{ id: string; name: string }>) {
        if (value.length > 0) {
          return (
            <CustomTagGroup visibleItems={3}>
              {value.map((group) => (
                <Box sx={{ mb: 1, mr: 1, display: 'inline-block' }} key={group.id}>
                  <Tag value={group.name} />
                </Box>
              ))}
            </CustomTagGroup>
          );
        }
        return '';
      },
      tableConfiguration: {
        width: '13%',
      },
      cardConfiguration: {
        position: 'body',
        notWrappedInTypography: true,
        hideIfEmpty: true,
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      getValue(value: string, row: Item) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        if (value === DelegationStatus.ACTIVE) {
          return <Chip label={label} color={color} data-testid={`statusChip-${label}`} />;
        } else {
          return <AcceptButton id={row.id} name={row.name as string} onAccept={handleAccept} />;
        }
      },
      tableConfiguration: {
        width: '20%',
        align: 'center',
      },
      cardConfiguration: {
        position: 'header',
        gridProps: {
          xs: 8,
        },
      },
    },
    {
      id: 'id',
      label: '',
      getValue(value: string, data: Item) {
        return <Menu menuType={'delegators'} id={value} row={data} onAction={handleUpdate} />;
      },
      tableConfiguration: {
        width: '5%',
      },
      cardConfiguration: {
        position: 'header',
        gridProps: {
          xs: 4,
        },
      },
    },
  ];

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const getOptionLabel = (option: { name: string; id: string }) => option.name || '';
  const renderOption = (
    props: any,
    option: { name: string; id: string },
    { selected }: AutocompleteRenderOptionState
  ) => (
    <li {...props} key={option.id}>
      <Checkbox
        icon={icon}
        checkedIcon={checkedIcon}
        style={{ marginRight: 8 }}
        checked={selected}
      />
      {option.name}
    </li>
  );

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
    void dispatch(getDelegators(delegatorsFilters));
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
    <>
      <Typography variant="h6" mb={4}>
        {t('deleghe.delegatorsTitle')}
      </Typography>
      <ApiErrorWrapper
        apiId={DELEGATION_ACTIONS.GET_DELEGATORS}
        reloadAction={() => dispatch(getDelegators(filters))}
        mainText={t('deleghe.delegatorsApiErrorMessage')}
      >
        {rows.length > 0 || !_.isEqual({ size: 10, page: 0 }, filters) ? (
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
            emptyStateProps={{
              sentimentIcon: KnownSentiment.DISSATISFIED,
              emptyMessage: t('deleghe.no_delegators_after_filters'),
              emptyActionLabel: t('button.annulla filtro', { ns: 'common' }),
              emptyActionCallback: clearFiltersHandler,
            }}
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
              <Grid item xs={12} lg={3}>
                <PnAutocomplete
                  id="groups"
                  size="small"
                  fullWidth
                  options={groups.filter((group) => group.status === GroupStatus.ACTIVE)}
                  disableCloseOnSelect
                  multiple
                  noOptionsText={t('deleghe.table.no-group-found')}
                  getOptionLabel={getOptionLabel}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  popupIcon={<SearchIcon />}
                  sx={{
                    [`& .MuiAutocomplete-popupIndicator`]: {
                      transform: 'none',
                    },
                    marginBottom: isMobile ? '20px' : '0',
                  }}
                  renderOption={renderOption}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('deleghe.table.group')}
                      placeholder={t('deleghe.table.group')}
                      name="groups"
                    />
                  )}
                  value={formik.values.groups}
                  onChange={(_event: any, newValue: Array<{ id: string; name: string }>) =>
                    handleChangeTouchedAutocomplete('groups', newValue)
                  }
                  data-testid="groups"
                  inputValue={groupInputValue}
                  onInputChange={(_event, newInputValue) => setGroupInputValue(newInputValue)}
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
          </SmartTable>
        ) : (
          <EmptyState
            sentimentIcon={KnownSentiment.NONE}
            emptyMessage={t('deleghe.no_delegators', { organizationName: organization.name })}
          />
        )}
      </ApiErrorWrapper>
    </>
  );
};

export default DelegationsOfTheCompany;
