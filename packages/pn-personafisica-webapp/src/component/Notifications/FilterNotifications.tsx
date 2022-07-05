import { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
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
  IUN_regex,
  filtersApplied,
  formatToTimezoneString,
  getNextDay
} from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { setNotificationFilters } from '../../redux/dashboard/actions';
import { Delegator } from '../../redux/delegation/types';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';

type Props = {
  showFilters: boolean;
  /** Delegator */
  currentDelegator?: Delegator;
};

const useStyles = makeStyles({
  helperTextFormat: {
    // Use existing space / prevents shifting content below field
    alignItems: 'flex',
  },
});

const initialEmptyValues = {
  startDate: tenYearsAgo,
  endDate: today,
  iunMatch: '',
};

const FilterNotifications = forwardRef(({ showFilters, currentDelegator }: Props, ref) => {
  const dispatch = useDispatch();
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const { t } = useTranslation(['common', 'notifiche']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const classes = useStyles();

  const emptyValues = {
    startDate: formatToTimezoneString(tenYearsAgo),
    endDate: formatToTimezoneString(getNextDay(today)),
    iunMatch: undefined,
    mandateId: currentDelegator?.mandateId,
  };

  const validationSchema = yup.object({
    iunMatch: yup.string().matches(IUN_regex, t('filters.errors.iun', {ns: 'notifiche'})),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const initialValues = useCallback(() => {
    if (!filters || (filters && _.isEqual(filters, emptyValues))) {
      return initialEmptyValues;
    }
    return {
      startDate: new Date(filters.startDate),
      endDate: new Date(filters.endDate),
      iunMatch: filters.iunMatch || '',
    };
  }, []);

  const [prevFilters, setPrevFilters] = useState(filters || emptyValues);
  const filtersCount = filtersApplied(prevFilters, emptyValues);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const currentFilters = {
        startDate: formatToTimezoneString(values.startDate),
        endDate: formatToTimezoneString(getNextDay(values.endDate)),
        iunMatch: values.iunMatch,
        mandateId: currentDelegator?.mandateId,
      };
      if (_.isEqual(prevFilters, currentFilters)) {
        return;
      }
      dispatch(setNotificationFilters(currentFilters));
      setPrevFilters(currentFilters);
    },
  });

  const cleanFilters = () => {
    dispatch(setNotificationFilters(emptyValues));
  };

  useEffect(() => {
    void formik.validateForm();
  }, []);

  useEffect(() => {
    if (filters && _.isEqual(filters, emptyValues)) {
      formik.resetForm({
        values: initialEmptyValues,
      });
      setStartDate(null);
      setEndDate(null);
      setPrevFilters(emptyValues);
    }
  }, [filters]);

  useImperativeHandle(ref, () => ({
    filtersApplied: filtersCount > 0,
    cleanFilters,
  }));

  if (!showFilters) {
    return <></>;
  }

  return isMobile ? (
    <CustomMobileDialog>
      <CustomMobileDialogToggle
        sx={{
          pl: 0,
          pr: filtersCount ? '10px' : 0,
          justifyContent: 'left',
          minWidth: 'unset',
          height: '24px',
        }}
        hasCounterBadge
        bagdeCount={filtersCount}
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
              filtersApplied={filtersCount > 0}
              isInitialSearch={_.isEqual(formik.values, initialEmptyValues)}
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
            filtersApplied={filtersCount > 0}
            isInitialSearch={_.isEqual(formik.values, initialEmptyValues)}
          />
        </Grid>
      </Box>
    </form>
  );
});

export default FilterNotifications;
