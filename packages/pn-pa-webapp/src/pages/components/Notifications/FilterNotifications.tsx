import { useEffect, Fragment, useState, forwardRef, useImperativeHandle } from 'react';
import { FormikValues, useFormik } from 'formik';
import * as yup from 'yup';
import _ from 'lodash';
import { Box, DialogActions, DialogContent } from '@mui/material';
import {
  fiscalCodeRegex,
  NotificationAllowedStatus,
  tenYearsAgo,
  today,
  IUN_regex,
  useIsMobile,
  CustomMobileDialog,
  CustomMobileDialogToggle,
  CustomMobileDialogContent,
  filtersApplied
} from '@pagopa-pn/pn-commons';

import { setNotificationFilters } from '../../../redux/dashboard/actions';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';

type Props = {
  showFilters: boolean;
};

const emptyValues = {
  startDate: tenYearsAgo.toISOString(),
  endDate: today.toISOString(),
  status: undefined,
  recipientId: undefined,
  iunMatch: undefined,
};

const initialEmptyValues = {
  searchFor: '0',
  startDate: tenYearsAgo,
  endDate: today,
  status: NotificationAllowedStatus[0].value,
  recipientId: '',
  iunMatch: '',
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const FilterNotifications = forwardRef(({showFilters}: Props, ref) => {
  const filters = useAppSelector((state: RootState) => state.dashboardState.filters);
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const isMobile = useIsMobile();

  const validationSchema = yup.object({
    recipientId: yup.string().matches(fiscalCodeRegex, 'Inserisci il codice per intero'),
    iunMatch: yup.string().matches(IUN_regex, 'Inserisci un codice IUN valido'),
    startDate: yup.date().min(tenYearsAgo),
    endDate: yup.date().min(tenYearsAgo),
  });

  const initialValues = (): FormikValues => {
    if (!filters || (filters && _.isEqual(filters, emptyValues))) {
      return initialEmptyValues;
    } else {
      return {
        searchFor: '0',
        startDate: new Date(filters.startDate),
        endDate: new Date(filters.endDate),
        recipientId: filters.recipientId || '',
        iunMatch: filters.iunMatch || '',
        status: filters.status || NotificationAllowedStatus[0].value,
      };
    }
  };

  const [prevFilters, setPrevFilters] = useState(filters || emptyValues);
  const filtersCount = filtersApplied(prevFilters, emptyValues);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema,
    /** onSubmit populates filters */
    onSubmit: (values) => {
      const currentFilters = {
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        recipientId: values.recipientId || undefined,
        iunMatch: values.iunMatch || undefined,
        status: values.status === 'All' ? undefined : values.status,
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
    filtersApplied: filtersCount > 0
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
        Filtra
      </CustomMobileDialogToggle>
      <CustomMobileDialogContent title="Filtra">
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
