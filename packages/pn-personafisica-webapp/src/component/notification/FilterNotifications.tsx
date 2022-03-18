import { useEffect, useState, ChangeEvent, Fragment } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Box, Button, DialogActions, DialogContent, Grid, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import {
  CustomMobileDialog,
  CustomMobileDialogAction,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  NotificationAllowedStatus,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { useDispatch } from 'react-redux';
import { setNotificationFilters } from '../../redux/dashboard/actions';

const useStyles = makeStyles({
  customButton: {
    height: '58px',
  },
  helperTextFormat: {
    // Use existing space / prevents shifting content below field
    alignItems: 'flex',
  },
});

const FilterNotifications = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'notifiche']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();

  const IUN_regex = /^[0-9A-Z_-]{1,20}$/i;

  const validationSchema = yup.object({
    iunMatch: yup.string().matches(IUN_regex, t('Inserire il codice corretto')),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const initialValues = {
    startDate: tenYearsAgo,
    endDate: today,
    iunMatch: '',
    status: NotificationAllowedStatus[0].value,
  };

  const formik = useFormik({
    initialValues,
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
        status: NotificationAllowedStatus[0].value,
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

  const formBody = (
    <Fragment>
      <Grid item lg={4} xs={12}>
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
          sx={{ marginBottom: isMobile ? '20px' : '0' }}
        />
      </Grid>
      <Grid item lg={2} xs={12}>
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
            renderInput={(params) => (
              <TextField
                id="startDate"
                name="startDate"
                {...params}
                fullWidth
                sx={{ marginBottom: isMobile ? '20px' : '0' }}
              />
            )}
            disableFuture={true}
            maxDate={endDate ? endDate : undefined}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item lg={2} xs={12}>
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
            renderInput={(params) => (
              <TextField
                id="endDate"
                name="endDate"
                {...params}
                fullWidth
                sx={{ marginBottom: isMobile ? '20px' : '0' }}
              />
            )}
            disableFuture={true}
            minDate={startDate ? startDate : undefined}
          />
        </LocalizationProvider>
      </Grid>
    </Fragment>
  );

  const formActions = [
    {
      key: 'confirm',
      component: (
        <Grid item lg={1} xs={12}>
          <Button
            variant="outlined"
            type="submit"
            className={isMobile ? undefined : classes.customButton}
            disabled={!formik.isValid}
          >
            {t('button.cerca')}
          </Button>
        </Grid>
      ),
      closeOnClick: true,
    },
    {
      key: 'cancel',
      component: (
        <Grid item lg={2} xs={12}>
          <Button
            data-testid="cancelButton"
            className={isMobile ? undefined : classes.customButton}
            onClick={cleanFilters}
          >
            {t('button.annulla ricerca')}
          </Button>
        </Grid>
      ),
      closeOnClick: true,
    },
  ];

  const filtersApplied = (): number => {
    const formValues = formik.values;
    return Object.entries(formValues).reduce((c: number, el: [string, any]) => {
      if (el[0] in initialValues && el[1] !== (initialValues as any)[el[0]]) {
        return c + 1;
      }
      return c;
    }, 0);
  };

  useEffect(() => {
    void formik.validateForm();
  }, []);

  return isMobile ? (
    <CustomMobileDialog>
      <CustomMobileDialogToggle
        sx={{ pl: 0 }}
        hasCounterBadge
        bagdeCount={filtersApplied()}
      >
        {t('button.cerca')}
      </CustomMobileDialogToggle>
      <CustomMobileDialogContent title={t('button.cerca')}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>{formBody}</DialogContent>
          <DialogActions>
            {formActions.map((a) => (
              <CustomMobileDialogAction key={a.key} closeOnClick={a.closeOnClick}>
                {a.component}
              </CustomMobileDialogAction>
            ))}
          </DialogActions>
        </form>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  ) : (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={1} alignItems="top" className={classes.helperTextFormat}>
          {formBody}
          {formActions.map((a) => (
            <Fragment key={a.key}>{a.component}</Fragment>
          ))}
        </Grid>
      </Box>
    </form>
  );
};

export default FilterNotifications;
