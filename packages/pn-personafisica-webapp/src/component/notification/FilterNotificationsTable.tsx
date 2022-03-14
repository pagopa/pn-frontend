import { useEffect, useState, ChangeEvent, Fragment } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Box, Button, Grid, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { NotificationAllowedStatus, tenYearsAgo, today } from '@pagopa-pn/pn-commons';

import { useDispatch } from 'react-redux';
import { setNotificationFilters } from '../../redux/dashboard/actions';

const useStyles = makeStyles({
  customButton: {
    height: '58px',
    alignSelf: 'center',
    verticalAlign: 'center',
    'margin-top': '25px !important',
  },
});

const FilterNotificationsTable = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'notifiche']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const IUN_regex = /^[0-9A-Z_-]{1,20}$/i;

  const validationSchema = yup.object({
    iunMatch: yup.string().matches(IUN_regex, 'Inserire il codice corretto'),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const formik = useFormik({
    initialValues: {
      startDate: tenYearsAgo,
      endDate: today,
      iunMatch: '',
      status: NotificationAllowedStatus[0].value,
    },
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const filters = {
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        iunMatch: values.iunMatch,
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
        iunMatch: undefined,
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
        <Box sx={{ flexGrow: 1, '& .MuiTextField-root': { mt: 3 } }}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={4}>
              <TextField
                id="iunMatch"
                value={formik.values.iunMatch}
                onChange={handleChangeTouched}
                label={t('filters.iun', { ns: 'notifiche' })}
                name="iunMatch"
                variant="outlined"
                error={formik.touched.iunMatch && Boolean(formik.errors.iunMatch)}
                helperText={formik.touched.iunMatch && formik.errors.iunMatch}
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <LocalizationProvider
                id="startDate"
                name="startDate"
                value={formik.values.startDate}
                dateAdapter={DateAdapter}
              >
                <DesktopDatePicker
                  label={t('filters.data_da', { ns: 'notifiche' })}
                  inputFormat="DD/MM/yyyy"
                  value={startDate}
                  onChange={(value: Date | null) => {
                    formik
                      .setFieldValue('startDate', value)
                      .then(() => {
                        setStartDate(value);
                      })
                      .catch(() => 'error');
                  }}
                  renderInput={(params) => <TextField id="startDate" name="startDate" {...params} />}
                  disableFuture={true}
                  maxDate={endDate ? endDate : undefined}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={2}>
              <LocalizationProvider
                id="endDate"
                name="endDate"
                value={formik.values.endDate}
                dateAdapter={DateAdapter}
                onChange={formik.handleChange}
              >
                <DesktopDatePicker
                  label={t('filters.data_a', { ns: 'notifiche' })}
                  inputFormat="DD/MM/yyyy"
                  value={endDate}
                  onChange={(value: Date | null) => {
                    formik
                      .setFieldValue('endDate', value)
                      .then(() => {
                        setEndDate(value);
                      })
                      .catch(() => 'error');
                  }}
                  renderInput={(params) => <TextField id="endDate" name="endDate" {...params} />}
                  disableFuture={true}
                  minDate={startDate ? startDate : undefined}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant="outlined"
                type="submit"
                className={classes.customButton}
                disabled={!formik.isValid}
              >
                {t('button.cerca')}
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button data-testid="cancelButton" className={classes.customButton} onClick={cleanFilters}>
              {t('button.annulla ricerca')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Fragment>
  );
};

export default FilterNotificationsTable;
