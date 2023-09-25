import { useFormik } from 'formik';
import _ from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import { Box, DialogActions, DialogContent, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  CustomMobileDialog,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  GetNotificationsParams,
  IUN_regex,
  dateIsDefined,
  filtersApplied,
  formatToTimezoneString,
  getValidValue,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { setNotificationFilters } from '../../redux/dashboard/reducers';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';

type Props = {
  showFilters: boolean;
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

function isFilterApplied(filtersCount: number): boolean {
  return filtersCount > 0;
}

const initialValues = (
  filters: GetNotificationsParams,
  emptyValues: {
    startDate: string;
    endDate: string;
    iunMatch: string;
  }
) => {
  if (!filters || (filters && _.isEqual(filters, emptyValues))) {
    return initialEmptyValues;
  }
  return {
    startDate: new Date(filters.startDate),
    endDate: new Date(filters.endDate),
    iunMatch: getValidValue(filters.iunMatch),
  };
};

const FilterNotifications = forwardRef(({ showFilters }: Props, ref) => {
  const dispatch = useDispatch();
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const { t } = useTranslation(['common', 'notifiche']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const classes = useStyles();
  const dialogRef = useRef<{ toggleOpen: () => void }>(null);

  const emptyValues = {
    startDate: formatToTimezoneString(tenYearsAgo),
    endDate: formatToTimezoneString(today),
    iunMatch: '',
  };

  const validationSchema = yup.object({
    iunMatch: yup.string().matches(IUN_regex, t('filters.errors.iun', { ns: 'notifiche' })),
    // the formik validations for dates (which control the enable status of the "filtra" button)
    // must coincide with the input field validations (which control the color of the frame around each field)
    startDate: yup.date().min(tenYearsAgo).max(today),
    endDate: yup
      .date()
      .min(dateIsDefined(startDate) ? startDate : tenYearsAgo)
      .max(today),
  });

  const [prevFilters, setPrevFilters] = useState(filters || emptyValues);
  const filtersCount = filtersApplied(prevFilters, emptyValues);

  const formik = useFormik({
    initialValues: initialValues(filters, emptyValues),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      trackEventByType(TrackEventType.NOTIFICATION_FILTER_SEARCH);
      const currentFilters = {
        startDate: formatToTimezoneString(values.startDate),
        endDate: formatToTimezoneString(values.endDate),
        iunMatch: values.iunMatch,
      };
      if (_.isEqual(prevFilters, currentFilters)) {
        return;
      }
      dispatch(setNotificationFilters(currentFilters));
      setPrevFilters(currentFilters);
      dialogRef.current?.toggleOpen();
    },
  });

  const cleanFilters = () => {
    trackEventByType(TrackEventType.NOTIFICATION_FILTER_REMOVE);
    dispatch(setNotificationFilters(emptyValues));
  };

  const setDates = () => {
    if (!_.isEqual(filters.startDate, formatToTimezoneString(tenYearsAgo))) {
      setStartDate(formik.values.startDate);
    }
    if (!_.isEqual(filters.endDate, formatToTimezoneString(today))) {
      setEndDate(formik.values.endDate);
    }
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
      return;
    }
    setDates();
  }, [filters]);

  useImperativeHandle(ref, () => ({
    filtersApplied: isFilterApplied(filtersCount),
    cleanFilters,
  }));

  if (!showFilters) {
    return <></>;
  }

  const isInitialSearch = _.isEqual(formik.values, initialEmptyValues);
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
      <CustomMobileDialogContent title={t('button.filtra')} ref={dialogRef}>
        <form onSubmit={formik.handleSubmit} data-testid="filter-form">
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
              cleanFilters={cleanFilters}
              filtersApplied={isFilterApplied(filtersCount)}
              isInitialSearch={isInitialSearch}
              isInDialog
            />
          </DialogActions>
        </form>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  ) : (
    <form onSubmit={formik.handleSubmit} data-testid="filter-form">
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
            cleanFilters={cleanFilters}
            filtersApplied={isFilterApplied(filtersCount)}
            isInitialSearch={isInitialSearch}
          />
        </Grid>
      </Box>
    </form>
  );
});

export default FilterNotifications;
