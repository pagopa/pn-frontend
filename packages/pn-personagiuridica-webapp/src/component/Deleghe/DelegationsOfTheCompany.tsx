import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  Button,
  Checkbox,
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
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
  SmartTable,
  SmartTableData,
} from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { DelegatorsColumn } from '../../models/Deleghe';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const arrayStatus = [
  { status: 'attiva', id: 1 },
  { status: 'revocata', id: 2 },
  { status: 'conclusa', id: 3 },
];

const DelegationsOfTheCompany = () => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );
  const rows: Array<Item> = delegationToItem(delegators);

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
  const getOptionLabel2 = (option: { name: string; id: number }) => option.name || '';
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

  return (
    <>
      <Typography variant="h6" mb={4}>
        {t('deleghe.delegatorsTitle')}
      </Typography>
      <Stack direction={'row'} spacing={2} mb={4}>
        <Autocomplete
          id="names"
          size="small"
          fullWidth
          options={[]}
          disableCloseOnSelect
          multiple
          noOptionsText={'Nessun nome in lista'}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          popupIcon={<SearchIcon />}
          sx={{
            width: '331px',
            height: '40px',
            [`& .MuiAutocomplete-popupIndicator`]: {
              transform: 'none',
            },
          }}
          renderOption={renderOption}
          renderInput={(params) => <TextField {...params} label="Nome" placeholder="Nome" />}
        />
        <Autocomplete
          id="group"
          size="small"
          fullWidth
          options={[]}
          disableCloseOnSelect
          multiple
          noOptionsText={'Nessun gruppo in lista'}
          getOptionLabel={getOptionLabel2}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          popupIcon={<SearchIcon />}
          sx={{
            width: '263px',
            height: '40px',
            [`& .MuiAutocomplete-popupIndicator`]: {
              transform: 'none',
            },
          }}
          renderOption={renderOption}
          renderInput={(params) => <TextField {...params} label="Gruppo" placeholder="Gruppo" />}
        />
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={[]}
            size="small"
            fullWidth
            // onChange={handleChange}
            input={<OutlinedInput label="Tag" />}
            renderValue={() => <></>}
            // MenuProps={MenuProps}
          >
            {arrayStatus.map(({ status }) => (
              <MenuItem key={status} value={status}>
                <Checkbox />
                <ListItemText primary={status} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          disabled={!rows}
          type="submit"
          sx={{ height: '43px' }}
        >
          {'Filtra'}
        </Button>
        <Button variant="text" size="small" sx={{ height: '40px' }}>
          {'Elimina filtri'}
        </Button>
      </Stack>
      <ApiErrorWrapper
        apiId={DELEGATION_ACTIONS.GET_DELEGATORS}
        reloadAction={() => dispatch(getDelegators())}
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
