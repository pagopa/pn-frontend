import React from 'react';
import { useFormik } from 'formik';
import { Box, Button, Divider, MenuItem, TextField } from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationFilters } from '../../../redux/dashboard/actions';
import { NotificationStatus } from '../../../redux/dashboard/types';
import { RootState } from '../../../redux/store';

const FilterNotificationsTable = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const filtersState = useSelector((state: RootState) => state.dashboardState.filters);

  const notificationAllowedStatus = [
    { value: 'All', label: 'Tutti gli stati' },
    { value: NotificationStatus.RECEIVED, label: 'Depositata' },
    { value: NotificationStatus.DELIVERED, label: 'Consegnata' },
    { value: NotificationStatus.DELIVERING, label: 'In inoltro' },
    { value: NotificationStatus.EFFECTIVE_DATE, label: 'Perfezionata per decorrenza termini' },
    { value: NotificationStatus.VIEWED, label: 'Perfezionata per visione' },
    { value: NotificationStatus.PAID, label: 'Pagata' },
    { value: NotificationStatus.CANCELED, label: 'Annullata' },
    { value: NotificationStatus.UNREACHABLE, label: 'Destinatario irreperibile' },
  ];

  const searchForValues = [
    { value: '0', label: 'Codice Fiscale' },
    { value: '1', label: 'Codice IUN' },
  ];

  
  const formik = useFormik({
    initialValues: {
      searchFor: 0,
      startDate: filtersState.startDate,
      endDate: filtersState.endDate,
      recipientId: filtersState.recipientId,
      status: filtersState.status,
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

  // useEffect(() => {
  //   dispatch(setNotificationFilters({formik.values.startDate, formik.values.endDate}));
  // }, []);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Box display={'flex'} sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
          <TextField
            id="outlined-basic"
            label="Cerca per"
            select
            name="searchFor"
            variant="outlined"
            value={formik.values.searchFor}
            onChange={formik.handleChange}
          >
            {searchForValues.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            value={formik.values.recipientId}
            onChange={formik.handleChange}
            name="recipientId"
            id="outlined-basic"
            variant="outlined"
          />
          <Divider orientation="vertical" variant="middle" flexItem />
          <LocalizationProvider
            name="startDate"
            value={formik.values.startDate}
            dateAdapter={DateAdapter}
          >
            <DesktopDatePicker
              label="Da"
              inputFormat="DD/MM/yyyy"
              value={startDate}
              onChange={(value: Date | null)  => {
                formik
                  .setFieldValue("startDate", value?.toISOString())
                  .then( () => {
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
              onChange={(value: Date | null)  => {
                formik
                  .setFieldValue("endDate", value?.toISOString())
                  .then( () => {
                    setEndDate(value);
                    console.log(value?.toISOString());
                  })
                  .catch(() => '');
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <TextField
            name="status"
            id="outlined-basic"
            label="Stato"
            select
            variant="outlined"
            onChange={formik.handleChange}
            value={formik.values.status}
          >
            {notificationAllowedStatus.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="outlined" type="submit">
            Filtra
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              // TODO questa può andare in un metodo separato: deve pulire i filtri dello stato redux e pulire il form
              dispatch(
                setNotificationFilters({
                  startDate: '',
                  endDate: '',
                  status: undefined,
                  recipientId: undefined,
                })
              )
            }
          >
            Rimuovi filtri
          </Button>
        </Box>
      </form>
    </React.Fragment>
  );
};

export default FilterNotificationsTable;
