import { add, isValid } from 'date-fns';
import { FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
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
  getNotificationAllowedStatus,
  getStartOfDay,
  getValidValue,
  sixMonthsAgo,
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
  startDate: sixMonthsAgo,
  endDate: today,
  status: '',
  recipientId: '',
  iunMatch: '',
};

const initialEmptyValues = { ...emptyValues, status: localizedNotificationStatus[0].value };

const initialValues = (filters: GetNotificationsParams<Date>): FormikValues => {
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

  const validationSchema = useMemo(() => {
    const rangeErrorMsg =
      t('filters.errors.max-six-months', { ns: 'notifiche' }) || 'Intervallo massimo: 6 mesi';

    const maxSixMonthsTest = (_value: Date | null | undefined, ctx: yup.TestContext) => {
      const { startDate, endDate } = (ctx.parent ?? {}) as {
        startDate?: Date | null;
        endDate?: Date | null;
      };

      if (!startDate || !endDate) {
        return true;
      }

      // verify startDate and endDate are both valid dates before validating range
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!isValid(start) || !isValid(end)) {
        return true;
      }

      const endAtStart = getStartOfDay(new Date(endDate));
      const minStart = add(endAtStart, { months: -6, days: 1 });

      return start >= minStart || ctx.createError({ message: rangeErrorMsg });
    };
    return yup.object({
      recipientId: yup
        .string()
        .matches(dataRegex.pIvaAndFiscalCode, t('filters.errors.fiscal-code', { ns: 'notifiche' })),
      iunMatch: yup.string().matches(IUN_regex, t('filters.errors.iun', { ns: 'notifiche' })),
      // the formik validations for dates (which control the enable status of the "filtra" button)
      // must coincide with the input field validations (which control the color of the frame around each field)
      startDate: yup
        .date()
        .nullable()
        .notRequired()
        .min(tenYearsAgo)
        .max(today)
        .test('max-six-months', rangeErrorMsg, maxSixMonthsTest),
      endDate: yup
        .date()
        .nullable()
        .notRequired()
        .min(dateIsDefined(startDate) ? startDate : tenYearsAgo)
        .max(today)
        .test('max-six-months', rangeErrorMsg, maxSixMonthsTest),
    });
  }, [startDate, endDate, t]);

  const [prevFilters, setPrevFilters] = useState(filters || emptyValues);
  const filtersCount = filtersApplied(prevFilters, emptyValues);

  const formik = useFormik({
    initialValues: initialValues(filters),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const start = values.startDate ? new Date(values.startDate) : null;
      const end = values.endDate ? new Date(values.endDate) : null;
      if (start && end) {
        const endAtStart = getStartOfDay(end);
        const minStart = add(endAtStart, { months: -6, days: 1 });
        if (start < minStart) {
          const msg =
            t('filters.errors.max-six-months', { ns: 'notifiche' }) || 'Intervallo massimo: 6 mesi';
          formik.setErrors({ startDate: msg, endDate: msg });
          return;
        }
      }
      const currentFilters = {
        startDate: values.startDate ?? sixMonthsAgo,
        endDate: values.endDate ?? today,
        recipientId: getValidValue(values.recipientId),
        iunMatch: getValidValue(values.iunMatch),
        status: getValidStatus(values.status),
      };
      if (_.isEqual(prevFilters, currentFilters)) {
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

  const setDates = () => {
    if (!_.isEqual(filters.startDate, sixMonthsAgo)) {
      setStartDate(formik.values.startDate);
    }
    if (!_.isEqual(filters.endDate, today)) {
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

  /**
   * Build a normalized snapshot of the current form values before comparing with `initialEmptyValues`.
   * In the UI, an empty date picker (null) means "use the implicit defaults" (last 6 months),
   * but Formik may still hold fallback dates set by the picker handlers. To avoid a false mismatch,
   * when a picker is empty we substitute the implicit defaults (sixMonthsAgo/today).
   * This way, clearing both dates (and leaving other fields empty) is treated as the true initial state
   * and the "Filter" button is correctly disabled.
   */
  const normalizedForInitial = {
    ...formik.values,
    startDate: startDate === null ? sixMonthsAgo : formik.values.startDate,
    endDate: endDate === null ? today : formik.values.endDate,
  };

  const isInitialSearch = _.isEqual(normalizedForInitial, initialEmptyValues);

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
      <Stack
        direction={'row'}
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
      </Stack>
    </form>
  );
});

export default FilterNotifications;
