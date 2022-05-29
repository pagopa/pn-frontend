import currentLocale from 'date-fns/locale/it';
import { useEffect, ChangeEvent, Fragment, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, MenuItem, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  CustomDatePicker,
  DATE_FORMAT,
  fiscalCodeRegex,
  NotificationAllowedStatus,
  tenYearsAgo,
  today,
} from '@pagopa-pn/pn-commons';

import { setNotificationFilters } from '../../../redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';

const useStyles = makeStyles({
  searchButton: {
    height: '43px !important',
    marginRight: '8px !important',
  },
  cancelButton: {
    height: '43px !important',
    padding: '0 16px !important',
    minWidth: '130px !important',
  },
});

const FilterNotificationsTable = () => {
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // TODO inserire regex corretta
  const IUN_regex = /^[0-9A-Z_-]{1,20}$/i;

  const emptyValues = {
    startDate: tenYearsAgo.toISOString(),
    endDate: today.toISOString(),
    status: undefined,
    recipientId: undefined,
    iunMatch: undefined,
  };

  const initialValues = () => {
    if (!filters || (filters && filters === emptyValues)) {
      return {
        searchFor: '0',
        startDate: tenYearsAgo,
        endDate: today,
        status: '',
        recipientId: '',
        iunMatch: '',
      };
    } else {
      return {
        searchFor: '0',
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
        recipientId: filters.recipientId || '',
        iunMatch: filters.iunMatch || '',
        status: filters.status || NotificationAllowedStatus[0].value,
      };
    }
  };

  const searchForValues = [
    { value: '0', label: 'Codice Fiscale' },
    { value: '1', label: 'Codice IUN' },
  ];

  const validationSchema = yup.object({
    recipientId: yup.string().matches(fiscalCodeRegex, 'Inserire il codice completo'),
    iunMatch: yup.string().matches(IUN_regex, 'Inserire il codice corretto'),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const currentFilters = {
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        recipientId: values.recipientId,
        iunMatch: values.iunMatch,
        status: values.status === 'All' ? undefined : values.status,
      };
      dispatch(setNotificationFilters(currentFilters));
    },
  });

  const cancelSearch = () => {
    dispatch(setNotificationFilters(emptyValues));
  };

  const classes = useStyles();

  const handleChangeTouched = (e: ChangeEvent) => {
    void formik.setFieldTouched(e.target.id, true, false);
    formik.handleChange(e);
  };

  useEffect(() => {
    void formik.validateForm();
  }, []);

  useEffect(() => {
    if (filters === emptyValues) {
      formik.resetForm({
        values: initialValues(),
      });
      setStartDate(null);
      setEndDate(null);
    }
  }, [filters]);

  return (
    <Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Box
          display={'flex'}
          sx={{
            marginTop: 5,
            verticalAlign: 'top',
            '& .MuiTextField-root': { mr: 1, width: '100%' },
          }}
        >
          <TextField
            id="searchFor"
            label="Cerca per"
            name="searchFor"
            value={formik.values.searchFor}
            onChange={formik.handleChange}
            select
            size="small"
          >
            {searchForValues.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          {formik.values.searchFor === '' || formik.values.searchFor === '0' ? (
            <TextField
              id="recipientId"
              value={formik.values.recipientId}
              onChange={handleChangeTouched}
              label="Codice fiscale"
              name="recipientId"
              error={formik.touched.recipientId && Boolean(formik.errors.recipientId)}
              helperText={formik.touched.recipientId && formik.errors.recipientId}
              disabled={!formik.values.searchFor}
              size="small"
            />
          ) : (
            <TextField
              id="iunMatch"
              value={formik.values.iunMatch}
              onChange={handleChangeTouched}
              label="Codice IUN"
              name="iunMatch"
              error={formik.touched.iunMatch && Boolean(formik.errors.iunMatch)}
              helperText={formik.touched.iunMatch && formik.errors.iunMatch}
              disabled={!formik.values.searchFor}
              size="small"
            />
          )}
          <LocalizationProvider
            id="startDate"
            name="startDate"
            value={formik.values.startDate}
            dateAdapter={DateAdapter}
            locale={currentLocale}
          >
            <CustomDatePicker
              label="Dalle"
              inputFormat={DATE_FORMAT}
              value={startDate}
              onChange={(value: Date | null) => {
                void formik.setFieldValue('startDate', value).then(() => {
                  setStartDate(value);
                });
              }}
              renderInput={(params) => (
                <TextField
                  id="startDate"
                  name="startDate"
                  size="small"
                  {...params}
                  aria-label="Data inizio ricerca" // aria-label for (TextField + Button) Group
                  inputProps={{
                    ...params.inputProps,
                    inputMode: 'text',
                    'aria-label': 'Inserisci la data iniziale della ricerca',
                    type: 'text',
                  }}
                />
              )}
              disableFuture={true}
              maxDate={endDate ? endDate : undefined}
            />
          </LocalizationProvider>
          <LocalizationProvider
            id="endDate"
            name="endDate"
            value={formik.values.endDate}
            dateAdapter={DateAdapter}
            onChange={formik.handleChange}
            locale={currentLocale}
          >
            <CustomDatePicker
              label="A"
              inputFormat={DATE_FORMAT}
              value={endDate}
              onChange={(value: Date | null) => {
                void formik.setFieldValue('endDate', value).then(() => {
                  setEndDate(value);
                });
              }}
              renderInput={(params) => (
                <TextField
                  id="endDate"
                  name="endDate"
                  size="small"
                  {...params}
                  aria-label="Data fine ricerca" // aria-label for (TextField + Button) Group
                  inputProps={{
                    ...params.inputProps,
                    inputMode: 'text',
                    'aria-label': 'inserisci la data finale della ricerca',
                    type: 'text',
                  }}
                />
              )}
              disableFuture={true}
              minDate={startDate ? startDate : undefined}
            />
          </LocalizationProvider>
          <TextField
            id="status"
            name="status"
            label="Stato"
            select
            onChange={formik.handleChange}
            value={formik.values.status}
            size="small"
          >
            {NotificationAllowedStatus.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="outlined"
            className={classes.searchButton}
            size="small"
            disabled={!formik.isValid}
          >
            Cerca
          </Button>
          <Button
            data-testid="cancelButton"
            className={classes.cancelButton}
            size="small"
            onClick={cancelSearch}
          >
            Annulla ricerca
          </Button>
        </Box>
      </form>
    </Fragment>
  );
};

export default FilterNotificationsTable;
