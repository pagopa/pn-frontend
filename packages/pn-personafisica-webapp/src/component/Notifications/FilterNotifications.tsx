import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FormikValues, useFormik } from 'formik';
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
  IUN_regex,
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

const FilterNotifications = forwardRef((_props, ref) => {
  const dispatch = useDispatch();
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const { t } = useTranslation(['common']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const classes = useStyles();

  const validationSchema = yup.object({
    iunMatch: yup.string().matches(IUN_regex, t('Inserisci un codice IUN valido')),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const emptyValues = {
    startDate: tenYearsAgo.toISOString(),
    endDate: today.toISOString(),
    iunMatch: undefined,
  };

  const initialEmptyValues = {
    startDate: tenYearsAgo,
    endDate: today,
    iunMatch: '',
  };

  const initialValues = () => {
    if (!filters || (filters && _.isEqual(filters, emptyValues))) {
      return initialEmptyValues;
    } else {
      return {
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
        iunMatch: filters.iunMatch || '',
      };
    }
  };

  const [prevFilters, setPrevFilters] = useState(filters || emptyValues);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const currentFilters = {
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        iunMatch: values.iunMatch,
      };
      if (_.isEqual(prevFilters, currentFilters)) {
        return;
      }
      dispatch(setNotificationFilters(currentFilters));
    },
  });

  const cleanFilters = () => {
    dispatch(setNotificationFilters(emptyValues));
  };

  const filtersApplied = (): number =>
    Object.entries(prevFilters).reduce((c: number, element: [string, any]) => {
      if (element[0] in emptyValues && element[1] !== (emptyValues as any)[element[0]]) {
        return c + 1;
      }
      return c;
    }, 0);

  useEffect(() => {
    if (filters && _.isEqual(filters, emptyValues)) {
      formik.resetForm({
        values: initialEmptyValues,
      });
      setStartDate(null);
      setEndDate(null);
      setPrevFilters(emptyValues);
    } else {
      setPrevFilters(filters);
    }
  }, [filters]);

  useEffect(() => {
    void formik.validateForm();
  }, []);

  useImperativeHandle(ref, () => ({
    filtersApplied: filtersApplied() > 0,
  }));

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
        {t('button.filtra')}
      </CustomMobileDialogToggle>
      <CustomMobileDialogContent title={t('button.filtra')}>
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
              filtersApplied={filtersApplied() > 0}
              isInitialSearch={_.isEqual(formik.values, initialValues)}
              isInDialog
            />
          </DialogActions>
        </form>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  ) : (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid container spacing={1} className={classes.helperTextFormat}>
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
            filtersApplied={filtersApplied() > 0}
            isInitialSearch={_.isEqual(formik.values, initialValues)}
          />
        </Grid>
      </Box>
    </form>
  );
});

export default FilterNotifications;
