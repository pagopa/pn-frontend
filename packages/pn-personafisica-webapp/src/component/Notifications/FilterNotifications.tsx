import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { Box, DialogActions, DialogContent, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  CustomMobileDialog,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
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
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const { t } = useTranslation(['common']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const classes = useStyles();

  const IUN_regex = /[A-Z]{4}-[A-Z]{4}-[A-Z]{4}-[A-Z]{6}-[A-Z]{1}-[0-9]{1}/;

  const validationSchema = yup.object({
    iunMatch: yup.string().matches(IUN_regex, t('Inserire il codice corretto')),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const emptyValues = {
    startDate: tenYearsAgo.toISOString(),
    endDate: today.toISOString(),
    iunMatch: undefined,
  };

  const initialValues = {
    startDate: tenYearsAgo,
    endDate: today,
    iunMatch: '',
  };
  const [prevFilters, setPrevFilters] = useState(initialValues);

  const submitForm = (values: { startDate: Date; endDate: Date; iunMatch: string }) => {
    if (prevFilters === values) {
      return;
    }
    const currentFilters = {
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString(),
      iunMatch: values.iunMatch,
    };
    setPrevFilters(values);
    /* eslint-enable functional/immutable-data */
    dispatch(setNotificationFilters(currentFilters));
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: submitForm,
  });

  const cleanFilters = () => {
    dispatch(setNotificationFilters(emptyValues));
  };

  const filtersApplied = (): number =>
    Object.entries(prevFilters).reduce((c: number, element: [string, any]) => {
      if (element[0] in initialValues && element[1] !== (initialValues as any)[element[0]]) {
        return c + 1;
      }
      return c;
    }, 0);

  useEffect(() => {
    if (filters && _.isEqual(filters, emptyValues)) {
      formik.resetForm({
        values: initialValues,
      });
      setPrevFilters(initialValues);
      /* eslint-enable functional/immutable-data */
      setStartDate(null);
      setEndDate(null);
    }
  }, [filters]);

  useEffect(() => {
    void formik.validateForm();
  }, []);

  return isMobile ? (
    <CustomMobileDialog>
      <CustomMobileDialogToggle
        sx={{
          pl: 0,
          pr: filtersApplied() ? '10px' : 0,
          justifyContent: 'left',
          minWidth: 'unset',
          height: '24px',
        }}
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
              setStartDate={(value) => setStartDate(value)}
              setEndDate={(value) => setEndDate(value)}
            />
          </DialogContent>
          <DialogActions>
            <FilterNotificationsFormActions
              formikInstance={formik}
              cleanFilters={cleanFilters}
              appliedFilters={filtersApplied()}
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
            setStartDate={(value) => setStartDate(value)}
            setEndDate={(value) => setEndDate(value)}
          />
          <FilterNotificationsFormActions
            formikInstance={formik}
            cleanFilters={cleanFilters}
            appliedFilters={filtersApplied()}
          />
        </Grid>
      </Box>
    </form>
  );
};

export default FilterNotifications;
