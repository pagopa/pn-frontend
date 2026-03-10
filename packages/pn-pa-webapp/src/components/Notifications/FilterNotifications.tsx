import { isBefore, isEqual as isEqualDate } from 'date-fns';
import { FormikValues, useFormik } from 'formik';
import { isEqual } from 'lodash-es';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { DialogActions, DialogContent, Stack } from '@mui/material';
import {
  CustomMobileDialog,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  GetNotificationsParams,
  IUN_regex,
  dataRegex,
  dateIsDefined,
  filtersApplied,
  formatDate,
  getNotificationAllowedStatus,
  getValidValue,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { setNotificationFilters } from '../../redux/dashboard/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';

type Props = {
  showFilters: boolean;
};

const localizedNotificationStatus = getNotificationAllowedStatus();

const emptyValues = {
  startDate: undefined,
  endDate: undefined,
  status: '',
  recipientId: '',
  iunMatch: '',
};

const initialEmptyValues = { ...emptyValues, status: localizedNotificationStatus[0].value };

const initialValues = (filters: GetNotificationsParams): FormikValues => {
  if (!filters || isEqual(filters, emptyValues)) {
    return initialEmptyValues;
  }
  return {
    startDate: filters.startDate ? new Date(filters.startDate) : undefined,
    endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    recipientId: getValidValue(filters.recipientId),
    iunMatch: getValidValue(filters.iunMatch),
    status: getValidValue(filters.status, localizedNotificationStatus[0].value),
  };
};

function isFilterapplied(filtersCount: number): boolean {
  return filtersCount > 0;
}

function validateDate(startDate: Date | undefined, endDate: Date | undefined) {
  if (!dateIsDefined(startDate) || !dateIsDefined(endDate)) {
    return true;
  }
  return isBefore(startDate, endDate) || isEqualDate(startDate, endDate);
}

const getValidStatus = (status: string) => (status === 'All' ? '' : status);

const FilterNotifications = forwardRef(({ showFilters }: Props, ref) => {
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const dispatch = useAppDispatch();
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
    startDate: yup
      .date()
      .test('startDate', t('filters.errors.date-start', { ns: 'notifiche' }), function (startDate) {
        const { endDate } = this.parent;
        return validateDate(startDate, endDate);
      })
      .min(
        tenYearsAgo,
        t('filters.errors.date-range', {
          ns: 'notifiche',
          fromDate: formatDate(tenYearsAgo),
          toDate: formatDate(today, false),
        })
      )
      .max(
        today,
        t('filters.errors.date-range', {
          ns: 'notifiche',
          fromDate: formatDate(tenYearsAgo),
          toDate: formatDate(today, false),
        })
      )
      .typeError(t('filters.errors.date-format', { ns: 'notifiche' })),
    endDate: yup
      .date()
      .test('endDate', t('filters.errors.date-end', { ns: 'notifiche' }), function (endDate) {
        const { startDate } = this.parent;
        return validateDate(startDate, endDate);
      })
      .min(
        tenYearsAgo,
        t('filters.errors.date-range', {
          ns: 'notifiche',
          fromDate: formatDate(tenYearsAgo),
          toDate: formatDate(today, false),
        })
      )
      .max(
        today,
        t('filters.errors.date-range', {
          ns: 'notifiche',
          fromDate: formatDate(tenYearsAgo),
          toDate: formatDate(today, false),
        })
      )
      .typeError(t('filters.errors.date-format', { ns: 'notifiche' })),
  });

  const [prevFilters, setPrevFilters] = useState(filters || emptyValues);
  const filtersCount = filtersApplied(prevFilters, emptyValues);

  const formik = useFormik({
    initialValues: initialValues(filters),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const currentFilters = {
        startDate: values.startDate,
        endDate: values.endDate,
        recipientId: getValidValue(values.recipientId),
        iunMatch: getValidValue(values.iunMatch),
        status: getValidStatus(values.status),
      };
      if (isEqual(prevFilters, currentFilters)) {
        return;
      }
      dispatch(setNotificationFilters(currentFilters));
      setPrevFilters(currentFilters);
      dialogRef.current?.toggleOpen();
    },
  });

  const cancelSearch = () => {
    dispatch(setNotificationFilters(emptyValues));
  };

  useEffect(() => {
    void formik.validateForm();
  }, []);

  useEffect(() => {
    if (isEqual(filters, emptyValues)) {
      formik.resetForm({
        values: initialEmptyValues,
      });
      setPrevFilters(emptyValues);
    }
  }, [filters]);

  useImperativeHandle(ref, () => ({
    filtersApplied: isFilterapplied(filtersCount),
    cleanFilters: cancelSearch,
  }));

  if (!showFilters) {
    return <></>;
  }

  const isInitialSearch = isEqual(formik.values, initialEmptyValues);

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
            <FilterNotificationsFormBody formikInstance={formik} />
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
      <Stack
        direction={'row'}
        sx={{
          marginTop: 5,
          marginBottom: 5,
          verticalAlign: 'top',
          '& .MuiTextField-root': { mr: 1, width: '100%' },
        }}
      >
        <FilterNotificationsFormBody formikInstance={formik} />
        <FilterNotificationsFormActions
          cleanFilters={cancelSearch}
          filtersApplied={isFilterapplied(filtersCount)}
          isInitialSearch={isInitialSearch}
        />
      </Stack>
    </form>
  );
});

export default FilterNotifications;
