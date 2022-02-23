import { useEffect, useState, ChangeEvent, Fragment } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { useDispatch } from 'react-redux';
import { setNotificationFilters } from '../../redux/dashboard/actions';
import { NotificationAllowedStatus } from '../../utils/status.utility';
import { tenYearsAgo, today } from '../../utils/date.utility';

const useStyles = makeStyles({
  customButton: {
    height: '60px',
    alignSelf: 'center',
  }
});

const FilterNotificationsTable = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const fiscalCode_regex = /^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Za-z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$/i;
 // TODO inserire regex corretta
  const IUN_regex = /^[A-Z]$/i;

  const searchForValues = [
    { value: '0', label: 'Codice Fiscale' },
    { value: '1', label: 'Codice IUN' },
  ];

  const validationSchema = yup.object({
    recipientId: yup.string().matches(fiscalCode_regex, "Inserire il codice completo"),
    iunId: yup.string().matches(IUN_regex, "Inserire il codice corretto"),
    startDate : yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo)
  });

  const formik = useFormik({
    initialValues: {
      searchFor: '',
      startDate: tenYearsAgo,
      endDate: today,
      recipientId: '',
      iunId: '',
      status: NotificationAllowedStatus[0].value,
    },
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const filters = {
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
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

  const handleChangeTouched = (e: ChangeEvent) => {
    void formik.setFieldTouched(e.target.id, true, false);
    formik.handleChange(e);
  };

  useEffect(() => {
    void formik.validateForm();
  }, []);

  return (
    <Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Box
          display={'flex'}
          sx={{ verticalAlign: 'top', '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        >
          <TextField
            id="searchFor"
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
          {formik.values.searchFor === '' || formik.values.searchFor === '0' ?
          <TextField
            id="recipientId"
            value={formik.values.recipientId}
            onChange={handleChangeTouched}
            label="Codice fiscale"
            name="recipientId"
            variant="outlined"
            error={formik.touched.recipientId && Boolean(formik.errors.recipientId)}
            helperText={formik.touched.recipientId && formik.errors.recipientId}
            disabled={!formik.values.searchFor}
          />
          :
          <TextField
            id="iunId"
            value={formik.values.iunId}
            onChange={handleChangeTouched}
            label="Codice IUN"
            name="iunId"
            variant="outlined"
            error={formik.touched.iunId && Boolean(formik.errors.iunId)}
            helperText={formik.touched.iunId && formik.errors.iunId}
            disabled={!formik.values.searchFor}
          />
        }
          <LocalizationProvider
            id="startDate"
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
                  .setFieldValue('startDate', value)
                  .then(() => { setStartDate(value);  })
                  .catch(() => 'error');
              }}
              renderInput={(params) => <TextField {...params} />}
              disableFuture={true}
              maxDate={endDate? endDate : undefined}
            />
          </LocalizationProvider>
          <LocalizationProvider
            id="endDate"
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
                  .setFieldValue('endDate', value)
                  .then(() => { setEndDate(value); })
                  .catch(() => 'error');
              }}
              renderInput={(params) => <TextField {...params} />}
              disableFuture={true}
              minDate={startDate? startDate : undefined}
            />
          </LocalizationProvider>
          <TextField
            id="status"
            name="status"
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
          <Button
            variant="outlined"
            type="submit"
            className={classes.customButton}
            disabled={!formik.isValid}
          >
            Cerca
          </Button>
          <Button className={classes.customButton} onClick={cleanFilters}>
            Annulla ricerca
          </Button>
        </Box>
      </form>
    </Fragment>
  );
};

export default FilterNotificationsTable;
