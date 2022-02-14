import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Divider, MenuItem, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
// import { NotificationStatus } from '../../../redux/dashboard/types';

const FilterNotificationsTable = () => {
  const [searchForSelection, setSearchForSelection] = useState('');
  const [searchForValue, setSearchForValue] = useState('');
  const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const [toDate, setToDate] = React.useState<Date | null>(null);
  const [notificationStatus, setNotificationStatus] = useState('Tutti gli stati');

  const initialValues = { 1: Number, 2: Number, 3: Number };
  // const notificationStatus = Object.values(NotificationStatus);

  const notificationAllowedStatus = [
    { value: 0, label: 'Tutti gli stati' },
    { value: 1, label: 'Depositata' },
    { value: 1, label: 'Consegnata' },
    { value: 1, label: 'In inoltro' },
    { value: 1, label: 'Perfezionata per decorrenza termini' },
    { value: 1, label: 'Perfezionata per visione' },
    { value: 1, label: 'Pagata' },
    { value: 1, label: 'Annullata' },
    { value: 1, label: 'Destinatario irreperibile' },
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
            <Divider orientation="vertical" flexItem />
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
              {notificationAllowedStatus.map((option2) => (
                <MenuItem key={option2.value} value={option2.value}>
                  {option2.label}
                </MenuItem>
              ))}
            </TextField>
            <button type="submit">Submit</button>
          </Box>
        </Form>
      </Formik>
    </React.Fragment>
  );
};

export default FilterNotificationsTable;
