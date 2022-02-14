import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Divider, MenuItem, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
// import { RootState } from '../../../redux/store';
// import { useSelector } from 'react-redux';

const FilterNotificationsTable = () => {
  const [searchForSelection, setSearchForSelection] = useState('');
  const [searchForValue, setSearchForValue] = useState('');
  const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const [toDate, setToDate] = React.useState<Date | null>(null);
  const [notificationStatus, setNotificationStatus] = useState('');

  // const filters = useSelector((state: RootState) => state.dashboardState.filters);

  const initialValues = { 1: Number, 2: Number, 3: Number };
  // const notificationStatus = Object.values(NotificationStatus);

  const notificationAllowedStatus = [
    { value: 0, label: 'Tutti gli stati' },
    { value: 1, label: 'Depositata' },
    { value: 2, label: 'Consegnata' },
    { value: 3, label: 'In inoltro' },
    { value: 4, label: 'Perfezionata per decorrenza termini' },
    { value: 5, label: 'Perfezionata per visione' },
    { value: 6, label: 'Pagata' },
    { value: 7, label: 'Annullata' },
    { value: 8, label: 'Destinatario irreperibile' },
  ];

  const searchForValues = [
    { value: 0, label: 'Codice Fiscale' },
    { value: 1, label: 'Codice IUN' },
  ];

  useEffect(() => {
    setSearchForSelection(searchForValues[0].label);
    setNotificationStatus(notificationAllowedStatus[0].label);
  }, []);

  return (
    <React.Fragment>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          // alert(JSON.stringify(values, null, 2));
          // actions.setSubmitting(false);
        }}
      >
        <Form>
          <Box
            component="form"
            display={"flex"}
            sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Cerca per"
              select
              variant="outlined"
              value={searchForSelection}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchForSelection(event.target.value);
              }}
            >
              {searchForValues.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={searchForValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchForValue(event.target.value);
              }}
            />
            <Divider orientation="vertical" variant="middle" flexItem />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Da"
                inputFormat="MM/dd/yyyy"
                value={fromDate}
                onChange={(newValue: Date | null) => {
                  setFromDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="A"
                inputFormat="MM/dd/yyyy"
                value={toDate}
                onChange={(newValue: Date | null) => {
                  setToDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              id="outlined-basic"
              label="Stato"
              select
              variant="outlined"
              value={notificationStatus}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNotificationStatus(event.target.value);
              }}
            >
              {notificationAllowedStatus.map((notStat) => (
                <MenuItem key={notStat.value} value={notStat.value}>
                  {notStat.label}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" type="submit" style={{display:"blok"}}>Filtra</Button>
            <Button variant="outlined">Rimuovi filtri</Button>
          </Box>
        </Form>
      </Formik>
    </React.Fragment>
  );
};

export default FilterNotificationsTable;
