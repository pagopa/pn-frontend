import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
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
  filtersApplied
} from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { setNotificationFilters } from '../../redux/dashboard/actions';
import FilterNotificationsFormBody from './FilterNotificationsFormBody';
import FilterNotificationsFormActions from './FilterNotificationsFormActions';

type Props = {
  showFilters: boolean;
};

const useStyles = makeStyles({
  helperTextFormat: {
    // Use existing space / prevents shifting content below field
    alignItems: 'flex',
  },
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

// eslint-disable-next-line sonarjs/cognitive-complexity
const FilterNotifications = forwardRef(({showFilters}: Props, ref) => {
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
  const filtersCount = filtersApplied(prevFilters, emptyValues);

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
            filtersApplied={filtersCount > 0}
            isInitialSearch={_.isEqual(formik.values, initialEmptyValues)}
          />
        </Grid>
      </Box>
    </form>
  );
});

export default FilterNotifications;
