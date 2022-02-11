import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, MenuItem, TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

const FilterNotificationsTable = () => {
  const [searchForSelection, setSearchForSelection] = useState('');
  const [searchForValue, setSearchForValue] = useState('');
  const [fromDate, setFromDate] = React.useState<Date | null>(null);
  const [toDate, setToDate] = React.useState<Date | null>(null);

  const initialValues = { 1: Number, 2: Number, 3: Number };

  const searchForValues = [
    {
      value: 0,
      label: 'Codice Fiscale',
    },
    {
      value: 1,
      label: 'Codice IUN',
    },
  ];

  const handleChangSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchForSelection(event.target.value);
  };

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchForValue(event.target.value);
  };

  useEffect(() => {}, []);

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
              onChange={handleChangSearch}
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
              onChange={handleChangeValue}
            />
            
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
                onChange={(newValue: Date | null) => {setToDate(newValue);}}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <button type="submit">Submit</button>
          </Box>
        </Form>
      </Formik>
    </React.Fragment>
  );
};

export default FilterNotificationsTable;
