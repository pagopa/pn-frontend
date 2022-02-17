import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useDispatch } from 'react-redux';
import { setNotificationFilters } from '../../../redux/dashboard/actions';
import { NotificationAllowedStatus } from '../../../utils/status.utility';
import { tenYearsAgo, today } from '../../../utils/date.utility';

const useStyles = makeStyles({
  customButton: {
    height: '60px',
    alignSelf: 'center',
  },
  customTextField: {
    //   height: '40px !important',
    //   alignSelf: 'center !important',
    //   ' & div': {
    //     height: '40px !important',
    //     fontSize:'16px',
    //   },
    //   padding:'0px !important'
  },
});

export default function FilterNotificationsTable() {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const searchForValues = [
    { value: '0', label: 'Codice Fiscale' },
    { value: '1', label: 'Codice IUN' },
  ];

  const formik = useFormik({
    initialValues: {
      searchFor: null,
      startDate: tenYearsAgo.toISOString(),
      endDate: today.toISOString(),
      recipientId: ' ',
      status: NotificationAllowedStatus[0].value,
    },
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const filters = {
        startDate: values.startDate,
        endDate: values.endDate,
        recipientId: values.recipientId,
        status: values.status === 'All' ? undefined : values.status,
      };
      dispatch(setNotificationFilters(filters));
    },
  });

  const cleanFilters = () => {
    // TODO questa può andare in un metodo separato: deve pulire i filtri dello stato redux e pulire il form
    dispatch(
      setNotificationFilters({
        startDate: tenYearsAgo.toISOString(),
        endDate: today.toISOString(),
        status: undefined,
        recipientId: undefined,
      })
    );
    formik.resetForm();
    setStartDate(null);
    setEndDate(null);
  };

  const classes = useStyles();

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
          <TextField
            className={classes.customTextField}
            label="Cerca per"
            name="searchFor"
            variant="outlined"
            value={formik.values.searchFor}
            onChange={formik.handleChange}
            select
          >
            {searchForValues.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className={classes.customTextField}
            value={formik.values.recipientId}
            onChange={formik.handleChange}
            label="Inserire codice intero"
            name="recipientId"
            variant="outlined"
          />
          <LocalizationProvider
            name="startDate"
            value={formik.values.startDate}
            dateAdapter={DateAdapter}
          >
            <DesktopDatePicker
              label="Da"
              inputFormat="DD/MM/yyyy"
              value={startDate}
              onChange={(value: Date | null) => {
                formik
                  .setFieldValue('startDate', value?.toISOString())
                  .then(() => {
                    setStartDate(value);
                    console.log(value?.toISOString());
                  })
                  .catch(() => '');
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <LocalizationProvider
            name="endDate"
            value={formik.values.endDate}
            dateAdapter={DateAdapter}
            onChange={formik.handleChange}
          >
            <DesktopDatePicker
              label="A"
              inputFormat="DD/MM/yyyy"
              value={endDate}
              onChange={(value: Date | null) => {
                formik
                  .setFieldValue('endDate', value?.toISOString())
                  .then(() => {
                    setEndDate(value);
                    console.log(value?.toISOString());
                  })
                  .catch(() => '');
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            className={classes.customTextField}
            name="status"
            id="outlined-basic"
            label="Stato"
            select
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.status}
          >
            {NotificationAllowedStatus.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" type="submit" className={classes.customButton}>
            Cerca
          </Button>
          <Button className={classes.customButton} onClick={cleanFilters}>
            Annulla ricerca
          </Button>
        </Box>
      </form>
    </React.Fragment>
  );
}
