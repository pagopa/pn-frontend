import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { CustomDropdown } from '@pagopa-pn/pn-commons';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];
const names2 = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const ProxiesChargedCompany = () => {
  const { t } = useTranslation(['deleghe']);
  const rows = false;
  const [personName, setPersonName] = useState<Array<string>>([]);
  const [personName2, setPersonName2] = useState<Array<string>>([]);

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleChange2 = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    setPersonName2(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <>
      <Box mb={8}>
        <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="h5">{t('deleghe.delegatorsTitle')}</Typography>
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="multiple-checkbox-label-name">Nome</InputLabel>
            <Select
              labelId="multiple-checkbox-label-name"
              id="demo-multiple-checkbox-name"
              multiple
              size="small"
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput label="Nome" />}
              IconComponent={() => <SearchIcon />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
              sx={{ textAlign: 'center' }}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ width: 300 }}>
            <InputLabel id="multiple-checkbox-label-group">Gruppo</InputLabel>
            <Select
              labelId="multiple-checkbox-label-group"
              id="multiple-checkbox-group"
              multiple
              size="small"
              value={personName2}
              onChange={handleChange2}
              IconComponent={() => <SearchIcon />}
              input={<OutlinedInput label="Gruppo" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {/* eslint-disable-next-line sonarjs/no-identical-functions */}
              {names2.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName2.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <CustomDropdown label="Stato" id={''} value={undefined}></CustomDropdown>
          <Button variant="outlined" disabled={!rows}>
            {'Filtra'}
          </Button>
          <Button variant="text">{'Elimina filtri'}</Button>
        </Stack>
      </Box>
    </>
  );
};

export default ProxiesChargedCompany;
