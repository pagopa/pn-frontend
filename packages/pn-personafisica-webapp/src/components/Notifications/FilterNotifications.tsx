import { FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';

import { Box, DialogActions, DialogContent, Grid } from '@mui/material';
import {
  CustomMobileDialog,
  CustomMobileDialogContent,
  CustomMobileDialogToggle,
  GetNotificationsParams,
  IUN_regex,
  dateIsDefined,
  filtersApplied,
  getValidValue,
  tenYearsAgo,
  today,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { setNotificationFilters } from '../../redux/dashboard/reducers';
import { Delegator } from '../../redux/delegation/types';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';

type Props = {
  showFilters: boolean;
  /** Delegator */
  currentDelegator?: Delegator;
};

function isFilterApplied(filtersCount: number): boolean {
  return filtersCount > 0;
}

const initialEmptyValues = { startDate: tenYearsAgo, endDate: today, iunMatch: '' };

const initialValues = (
  filters: GetNotificationsParams<Date>,
  emptyValues: {
    startDate: Date;
    endDate: Date;
    iunMatch: string;
    mandateId: string | undefined;
  }
): FormikValues => {
  if (!filters || _.isEqual(filters, emptyValues)) {
    return initialEmptyValues;
  }
  return {
    startDate: new Date(filters.startDate),
    endDate: new Date(filters.endDate),
    iunMatch: getValidValue(filters.iunMatch),
  };
};

const submitForm = async (form: HTMLFormElement, formik: FormikValues) => {
  const errors = await formik.validateForm();
  if (Object.keys(errors).length > 0) {
    const field = Object.keys(errors)[0];
    const el = form.querySelector<HTMLInputElement>(`[name="${field}"]`);
    el?.focus();
    return;
  }
  await formik.submitForm();
};

const FilterNotifications = forwardRef(({ showFilters, currentDelegator }: Props, ref) => {
  const dispatch = useDispatch();
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const { t } = useTranslation(['common', 'notifiche']);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const dialogRef = useRef<{ toggleOpen: () => void }>(null);

  const emptyValues = {
    startDate: tenYearsAgo,
    endDate: today,
    iunMatch: '',
    mandateId: currentDelegator?.mandateId,
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
      const currentFilters = {
        startDate: values.startDate,
        endDate: values.endDate,
        iunMatch: values.iunMatch,
        mandateId: currentDelegator?.mandateId,
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
    dispatch(setNotificationFilters(emptyValues));
  };

  const setDates = () => {
    if (!_.isEqual(filters.startDate, tenYearsAgo)) {
      setStartDate(formik.values.startDate);
    }
    if (!_.isEqual(filters.endDate, today)) {
      setEndDate(formik.values.endDate);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitForm(e.currentTarget, formik);
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
        <form onSubmit={handleSubmit} data-testid="filter-form">
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
    <form onSubmit={handleSubmit} data-testid="filter-form">
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        <Grid
          container
          spacing={1}
          sx={{
            // Use existing space / prevents shifting content below field
            alignItems: 'flex',
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
