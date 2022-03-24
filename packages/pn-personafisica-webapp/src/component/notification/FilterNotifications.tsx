import { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Box, DialogActions, DialogContent, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  CustomMobileDialog,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  NotificationAllowedStatus,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { useDispatch } from 'react-redux';
import { setNotificationFilters } from '../../redux/dashboard/actions';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';

const useStyles = makeStyles({
  helperTextFormat: {
    // Use existing space / prevents shifting content below field
    alignItems: 'flex',
  },
});

const FilterNotifications = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(['common']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const classes = useStyles();

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
  const prevFilters = useRef(initialValues);

  const submitForm = (values: {
    startDate: Date;
    endDate: Date;
    iunMatch: string;
    status: string;
  }) => {
    if (prevFilters.current === values) {
      return;
    }
    const filters = {
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      iunMatch: values.iunMatch,
      status: values.status === 'All' ? undefined : values.status,
    };
    /* eslint-disable functional/immutable-data */
    prevFilters.current = values;
    /* eslint-enable functional/immutable-data */
    dispatch(setNotificationFilters(filters));
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: submitForm,
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
    /* eslint-disable functional/immutable-data */
    prevFilters.current = initialValues;
    /* eslint-enable functional/immutable-data */
    changeDate(null, 'start');
    changeDate(null, 'end');
  };

  const changeDate = (value: Date | null, type: 'start' | 'end') => {
    if (type === 'start') {
      setStartDate(value);
    }
    if (type === 'end') {
      setEndDate(value);
    }
  };

  const filtersApplied = (): number => {
    const formValues = prevFilters.current;
    return Object.entries(formValues).reduce((c: number, element: [string, any]) => {
      if (element[0] in initialValues && element[1] !== (initialValues as any)[element[0]]) {
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
        sx={{ pl: 0, pr: filtersApplied() ? '10px' : 0, justifyContent: 'left', minWidth: 'unset' }}
        hasCounterBadge
        bagdeCount={filtersApplied()}
      >
        {t('button.cerca')}
      </CustomMobileDialogToggle>
      <CustomMobileDialogContent title={t('button.cerca')}>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <FilterNotificationsFormBody
              formikInstance={formik}
              startDate={startDate}
              endDate={endDate}
              setStartDate={(value) => changeDate(value, 'start')}
              setEndDate={(value) => changeDate(value, 'end')}
            />
          </DialogContent>
          <DialogActions>
            <FilterNotificationsFormActions
              formikInstance={formik}
              cleanFilters={cleanFilters}
              isInDialog
            />
          </DialogActions>
        </form>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  ) : (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={1} alignItems="top" className={classes.helperTextFormat}>
          <FilterNotificationsFormBody
            formikInstance={formik}
            startDate={startDate}
            endDate={endDate}
            setStartDate={(value) => changeDate(value, 'start')}
            setEndDate={(value) => changeDate(value, 'end')}
          />
          <FilterNotificationsFormActions formikInstance={formik} cleanFilters={cleanFilters} />
        </Grid>
      </Box>
    </form>
  );
};

export default FilterNotifications;
