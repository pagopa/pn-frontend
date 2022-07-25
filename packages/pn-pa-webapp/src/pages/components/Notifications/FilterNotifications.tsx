import { useEffect, Fragment, useState, forwardRef, useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { FormikValues, useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { Box, DialogActions, DialogContent } from '@mui/material';
import {
  fiscalCodeRegex,
  getNotificationAllowedStatus,
  tenYearsAgo,
  today,
  IUN_regex,
  useIsMobile,
  CustomMobileDialog,
  CustomMobileDialogToggle,
  CustomMobileDialogContent,
  filtersApplied,
  getValidValue,
  formatToTimezoneString,
  getNextDay,
} from '@pagopa-pn/pn-commons';

import { setNotificationFilters } from '../../../redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';

type Props = {
  showFilters: boolean;
};

const localizedNotificationStatus = getNotificationAllowedStatus();

const emptyValues = {
  startDate: formatToTimezoneString(tenYearsAgo),
  endDate: formatToTimezoneString(getNextDay(today)),
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

// eslint-disable-next-line sonarjs/cognitive-complexity
const FilterNotifications = forwardRef(({ showFilters }: Props, ref) => {
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const { t } = useTranslation(['common', 'notifiche']);

  const validationSchema = yup.object({
    recipientId: yup.string().matches(fiscalCodeRegex, t('filters.errors.fiscal-code', {ns: 'notifiche'})),
    iunMatch: yup.string().matches(IUN_regex, t('filters.errors.iun', {ns: 'notifiche'})),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const initialValues = (): FormikValues => {
    if (!filters || (filters && _.isEqual(filters, emptyValues))) {
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
        recipientId: getValidValue(values.recipientId),
        iunMatch: getValidValue(values.iunMatch),
        status: values.status === 'All' ? '' : values.status,
      };
      if (_.isEqual(prevFilters, currentFilters)) {
        return;
      }
      dispatch(setNotificationFilters(currentFilters));
      setPrevFilters(currentFilters);
    },
  });

  const cancelSearch = () => {
    dispatch(setNotificationFilters(emptyValues));
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
    }
  }, [filters]);

  useImperativeHandle(ref, () => ({
    filtersApplied: filtersCount > 0,
    cleanFilters: cancelSearch,
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
              cleanFilters={cancelSearch}
              filtersApplied={filtersCount > 0}
              isInitialSearch={_.isEqual(formik.values, initialEmptyValues)}
              isInDialog
            />
          </DialogActions>
        </form>
      </CustomMobileDialogContent>
    </CustomMobileDialog>
  ) : (
    <Fragment>
      <form onSubmit={formik.handleSubmit}>
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
            formikInstance={formik}
            cleanFilters={cancelSearch}
            filtersApplied={filtersCount > 0}
            isInitialSearch={_.isEqual(formik.values, initialEmptyValues)}
          />
        </Box>
      </form>
    </Fragment>
  );
});

export default FilterNotifications;
