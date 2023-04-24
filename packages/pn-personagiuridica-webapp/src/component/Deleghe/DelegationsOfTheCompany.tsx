import { useFormik } from 'formik';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
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
  EmptyState,
  Item,
  KnownSentiment,
  SmartFilter,
  SmartTable,
  SmartTableData,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { DelegatorsColumn, GetDelegatorsFilters } from '../../models/Deleghe';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const arrayStatus = [
  { status: 'attiva', id: '1' },
  { status: 'revocata', id: '2' },
  { status: 'conclusa', id: '3' },
];

const DelegationsOfTheCompany = () => {
  const { t } = useTranslation(['deleghe', 'common']);
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );
  const rows: Array<Item> = delegationToItem(delegators);
  const [filters, setFilters] = useState<GetDelegatorsFilters>({ size: 10 });

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
          return <AcceptButton id={row.id} name={row.name as string} />;
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
      getValue(value: string) {
        return <Menu menuType={'delegators'} id={value} />;
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
  const getOptionLabel = (option: { name: string; id: number }) => option.name || '';
  const renderOption = (
    props: any,
    option: { name: string; id: number },
    { selected }: AutocompleteRenderOptionState
  ) => (
    <li {...props}>
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
    delegatorIds: Array<{ id: number; name: string }>;
    groups: Array<{ id: number; name: string }>;
    status: Array<string>;
  } = {
    delegatorIds: [],
    groups: [],
    status: [],
  };

  const validationSchema = yup.object({
    delegatorIds: yup.array(),
    groups: yup.array(),
    status: yup.array(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const params = {
        size: filters.size,
        status: values.status,
        delegatorIds: values.delegatorIds.map((d) => d.id.toString()),
        groups: values.groups.map((d) => d.id.toString()),
      } as GetDelegatorsFilters;
      setFilters(params);
    },
  });

  const clearFiltersHandler = () => {
    const params = {
      size: filters.size,
    } as GetDelegatorsFilters;
    setFilters(params);
  };

  const handleChangeTouched = async (e: any) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  useEffect(() => {
    void dispatch(getDelegators(filters));
  }, [filters]);

  return (
    <>
      <Typography variant="h6" mb={4}>
        {t('deleghe.delegatorsTitle')}
      </Typography>
      <SmartFilter
        filterLabel={t('button.filtra', { ns: 'common' })}
        cancelLabel={t('button.annulla filtro', { ns: 'common' })}
        onSubmit={formik.handleSubmit}
        onClear={clearFiltersHandler}
        formIsValid={formik.isValid}
        formValues={formik.values}
        initialValues={initialValues}
      >
        <Grid item xs={12} lg>
          <Autocomplete
            id="delegatorIds"
            size="small"
            fullWidth
            options={[]}
            disableCloseOnSelect
            multiple
            noOptionsText={t('deleghe.table.no-name-found')}
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
                label={t('deleghe.table.name')}
                placeholder={t('deleghe.table.name')}
                name="delegatorIds"
              />
            )}
            value={formik.values.delegatorIds}
            onChange={handleChangeTouched}
          />
        </Grid>
        <Grid item xs={12} lg={3}>
          <Autocomplete
            id="groups"
            size="small"
            fullWidth
            options={[]}
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
            onChange={handleChangeTouched}
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
                  {selected.map((value: any) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              ),
              multiple: true,
            }}
            variant="outlined"
            value={formik.values.status}
            onChange={handleChangeTouched}
          >
            {arrayStatus.map(({ id, status }) => (
              <MenuItem key={id} value={id}>
                <Checkbox checked={formik.values.status.includes(id)} />
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </SmartFilter>
      <ApiErrorWrapper
        apiId={DELEGATION_ACTIONS.GET_DELEGATORS}
        reloadAction={() => dispatch(getDelegators(filters))}
        mainText={t('deleghe.delegatorsApiErrorMessage')}
      >
        {rows.length > 0 ? (
          <SmartTable conf={smartCfg} data={rows} />
        ) : (
          <EmptyState
            sentimentIcon={KnownSentiment.NONE}
            emptyMessage={t('deleghe.no_delegators', { recipient: organization.name })}
          />
        )}
      </ApiErrorWrapper>
    </>
  );
};

export default DelegationsOfTheCompany;
