import { FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, DialogActions, DialogContent } from '@mui/material';
import {
  CustomMobileDialog,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  GetNotificationsParams,
  IUN_regex,
  dataRegex,
  dateIsDefined,
  filtersApplied,
  formatToTimezoneString,
  getNotificationAllowedStatus,
  getValidValue,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { setNotificationFilters } from '../../../redux/dashboard/reducers';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { TrackEventType } from '../../../utils/events';
import { trackEventByType } from '../../../utils/mixpanel';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';

type Props = {
  showFilters: boolean;
};

const localizedNotificationStatus = getNotificationAllowedStatus();

const emptyValues = {
  startDate: formatToTimezoneString(tenYearsAgo),
  endDate: formatToTimezoneString(today),
  status: '',
  recipientId: '',
  iunMatch: '',
};

const initialEmptyValues = {
  startDate: tenYearsAgo,
  endDate: today,
  status: localizedNotificationStatus[0].value,
  recipientId: '',
  iunMatch: '',
};

const initialValues = (filters: GetNotificationsParams): FormikValues => {
  if (!filters || _.isEqual(filters, emptyValues)) {
    return initialEmptyValues;
  }
  return {
    startDate: new Date(filters.startDate),
    endDate: new Date(filters.endDate),
    recipientId: getValidValue(filters.recipientId),
    iunMatch: getValidValue(filters.iunMatch),
    status: getValidValue(filters.status, localizedNotificationStatus[0].value),
  };
};

function isFilterapplied(filtersCount: number): boolean {
  return filtersCount > 0;
}

const getValidStatus = (status: string) => (status === 'All' ? '' : status);

const FilterNotifications = forwardRef(({ showFilters }: Props, ref) => {
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['common', 'notifiche']);
  const dialogRef = useRef<{ toggleOpen: () => void }>(null);

  const validationSchema = yup.object({
    recipientId: yup
      .string()
      .matches(dataRegex.pIvaAndFiscalCode, t('filters.errors.fiscal-code', { ns: 'notifiche' })),
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
    initialValues: initialValues(filters),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const currentFilters = {
        startDate: formatToTimezoneString(values.startDate),
        endDate: formatToTimezoneString(values.endDate),
        recipientId: getValidValue(values.recipientId),
        iunMatch: getValidValue(values.iunMatch),
        status: getValidStatus(values.status),
      };
      if (_.isEqual(prevFilters, currentFilters)) {
        return;
      }
      trackEventByType(TrackEventType.NOTIFICATION_FILTER_SEARCH);
      dispatch(setNotificationFilters(currentFilters));
      setPrevFilters(currentFilters);
      dialogRef.current?.toggleOpen();
    },
  });

  const cancelSearch = () => {
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
    if (_.isEqual(filters, emptyValues)) {
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
    filtersApplied: isFilterapplied(filtersCount),
    cleanFilters: cancelSearch,
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
              cleanFilters={cancelSearch}
              filtersApplied={isFilterapplied(filtersCount)}
              isInitialSearch={isInitialSearch}
              isInDialog
            />
          </DialogActions>
        </form>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  ) : (
    <form onSubmit={formik.handleSubmit} data-testid="filter-form">
      <Box
        display={'flex'}
        sx={{
          marginTop: 5,
          marginBottom: 5,
          verticalAlign: 'top',
          '& .MuiTextField-root': { mr: 1, width: '100%' },
        }}
      >
        <FilterNotificationsFormBody
          formikInstance={formik}
          startDate={startDate}
          endDate={endDate}
          setStartDate={(value) => setStartDate(value)}
          setEndDate={(value) => setEndDate(value)}
        />
        <FilterNotificationsFormActions
          cleanFilters={cancelSearch}
          filtersApplied={isFilterapplied(filtersCount)}
          isInitialSearch={isInitialSearch}
        />
      </Box>
    </form>
  );
});

export default FilterNotifications;
