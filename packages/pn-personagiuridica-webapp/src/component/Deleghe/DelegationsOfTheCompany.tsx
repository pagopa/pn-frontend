import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  AutocompleteRenderOptionState,
  Box,
  Button,
  Checkbox,
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

const arrayStatus = [
  { status: 'attiva', id: 1 },
  { status: 'revocata', id: 2 },
  { status: 'conclusa', id: 3 },
];

const DelegationsOfTheCompany = () => {
  const { t } = useTranslation(['deleghe']);
  const rows = false;
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
    <Box mb={8}>
      <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h6">{t('deleghe.delegatorsTitle')}</Typography>
      </Stack>
      <Stack direction={'row'} spacing={2} sx={{ width: '1082px' }}>
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
    </Box>
  );
};

export default DelegationsOfTheCompany;
