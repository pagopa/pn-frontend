import { FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, Chip } from '@mui/material';
import { Box, Stack } from '@mui/system';
import {
  CustomDatePicker,
  DATE_FORMAT,
  DatePickerTypes,
  dateIsDefined,
  oneMonthAgo,
  sixMonthsAgo,
  tenYearsAgo,
  threeMonthsAgo,
  today,
  twelveMonthsAgo,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import {
  GraphColors,
  SelectedStatisticsFilter,
  SelectedStatisticsFilterKeys,
  StatisticsFilter,
} from '../../models/Statistics';
import { useAppDispatch } from '../../redux/hooks';
import { setStatisticsFilter } from '../../redux/statistics/reducers';

const quickFilters = Object.values(SelectedStatisticsFilter).filter((value) => value !== 'custom');

export const defaultValues = {
  startDate: oneMonthAgo,
  endDate: today,
  selected: SelectedStatisticsFilter.lastMonth,
};

type Props = {
  filter: StatisticsFilter | null;
};

const FilterStatistics: React.FC<Props> = ({ filter }) => {
  const { t, i18n } = useTranslation(['statistics']);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState<Date | null>(
    filter?.startDate ?? defaultValues.startDate
  );
  const [endDate, setEndDate] = useState<Date | null>(filter?.endDate ?? defaultValues.endDate);

  const initialValues = (filter: StatisticsFilter | null): FormikValues => {
    if (!filter || _.isEqual(filter, defaultValues)) {
      return defaultValues;
    }
    return {
      startDate: filter.startDate,
      endDate: filter.endDate,
      selected: filter.selected,
    };
  };

  const validationSchema = yup.object({
    // the formik validations for dates (which control the enable status of the "filtra" button)
    // must coincide with the input field validations (which control the color of the frame around each field)
    startDate: yup.date().min(tenYearsAgo).max(today),
    endDate: yup
      .date()
      .min(dateIsDefined(startDate) ? startDate : tenYearsAgo)
      .max(today),
    selected: yup
      .mixed<SelectedStatisticsFilterKeys>()
      .oneOf(Object.values(SelectedStatisticsFilter)),
  });

  const formik = useFormik({
    initialValues: initialValues(filter),
    validationSchema,
    /** onSubmit populates filter */
    onSubmit: () => {},
  });

  const getRangeDates = (
    range: SelectedStatisticsFilterKeys,
    loading: boolean = false
  ): [Date, Date] => {
    switch (range) {
      case SelectedStatisticsFilter.lastMonth:
        return [oneMonthAgo, today];
      case SelectedStatisticsFilter.last3Months:
        return [threeMonthsAgo, today];
      case SelectedStatisticsFilter.last6Months:
        return [sixMonthsAgo, today];
      case SelectedStatisticsFilter.last12Months:
        return [twelveMonthsAgo, today];
      case SelectedStatisticsFilter.custom:
        return loading
          ? [filter?.startDate ?? defaultValues.startDate, filter?.endDate ?? defaultValues.endDate]
          : [startDate ?? formik.values.startDate, endDate ?? formik.values.endDate];
      default:
        return [defaultValues.startDate, defaultValues.endDate];
    }
  };

  const setFilter = (type: SelectedStatisticsFilterKeys, loading = false): void => {
    const [startDate, endDate] = getRangeDates(type, loading);
    formik
      .setValues({
        startDate,
        endDate,
        selected: type,
      })
      .catch((error) => console.log(`${error}`));
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleSelectFilter = (type: SelectedStatisticsFilterKeys) => {
    const [startDate, endDate] = getRangeDates(type);
    dispatch(
      setStatisticsFilter({
        startDate,
        endDate,
        selected: type,
      })
    );
  };

  const cleanFilter = () => {
    handleSelectFilter(defaultValues.selected);
  };

  const filterChanged =
    !_.isEqual(filter?.startDate, startDate) || !_.isEqual(filter?.endDate, endDate);

  const isInitialSearch = _.isEqual(formik.values, defaultValues);

  const quickFiltersJsx = (): Array<JSX.Element> =>
    quickFilters.map((elem) => (
      <Chip
        key={elem}
        data-testid={`filter.${elem}`}
        label={t(`filter.${elem}`)}
        sx={{
          mr: 1,
          my: { xl: 0, xs: 1 },
          background: elem === formik.values.selected ? GraphColors.lightBlue2 : 'none',
          color: 'primary',
          opacity: '1 !important',
        }}
        disabled={elem === formik.values.selected}
        variant="outlined"
        component="button"
        color={elem === formik.values.selected ? 'primary' : 'default'}
        onClick={() => handleSelectFilter(elem)}
      />
    ));

  useEffect(() => {
    setFilter(filter?.selected ?? defaultValues.selected, true);
  }, [filter]);
  return (
    <Stack
      direction={{ xl: 'row', xs: 'column' }}
      mt={4}
      spacing={1}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      data-testid="statistics-filter"
    >
      <Box flexGrow={0} flexShrink={0}>
        {quickFiltersJsx()}
      </Box>
      <Box sx={{ display: isMobile ? 'block' : 'flex' }}>
        <CustomDatePicker
          language={i18n.language}
          label={t('filter.from_date')}
          format={DATE_FORMAT}
          value={startDate}
          onChange={(value: DatePickerTypes) => {
            void formik
              .setValues((values) => ({
                ...values,
                startDate: value ?? defaultValues.startDate,
              }))
              .then(() => {
                setStartDate(value);
              });
          }}
          slotProps={{
            textField: {
              id: 'startDate',
              name: 'startDate',
              size: 'small',
              'aria-label': t('filter.from_date-aria-label'),
              inputProps: {
                inputMode: 'text',
                placeholder: 'gg/mm/aaaa',
                type: 'text',
                'aria-label': t('filter.from_date-input-aria-label'),
              },
              sx: { mb: isMobile ? 1 : 0, mr: 1 },
              fullWidth: isMobile,
            },
          }}
          disableFuture={true}
          minDate={tenYearsAgo}
          maxDate={endDate ?? undefined}
        />
        <CustomDatePicker
          language={i18n.language}
          label={t('filter.to_date')}
          format={DATE_FORMAT}
          value={endDate}
          onChange={(value: DatePickerTypes) => {
            void formik
              .setValues((values) => ({
                ...values,
                endDate: value ?? defaultValues.endDate,
              }))
              .then(() => {
                setEndDate(value);
              });
          }}
          slotProps={{
            textField: {
              id: 'endDate',
              name: 'endDate',
              size: 'small',
              'aria-label': t('filter.to_date-aria-label'),
              inputProps: {
                inputMode: 'text',
                placeholder: 'gg/mm/aaaa',
                type: 'text',
                'aria-label': t('filter.to_date-input-aria-label'),
              },
              sx: { mb: isMobile ? 1 : 0, mr: 1 },
              fullWidth: isMobile,
            },
          }}
          disableFuture={true}
          minDate={startDate ?? tenYearsAgo}
        />
        <Button
          id="filter-button"
          data-testid="filterButton"
          variant="outlined"
          type="button"
          onClick={() => handleSelectFilter(SelectedStatisticsFilter.custom)}
          size="small"
          sx={{
            height: '43px !important',
            mr: 1,
            // marginRight: '8px !important',
          }}
          disabled={isInitialSearch || !filterChanged || !formik.isValid}
        >
          {t('filter.buttons.filter')}
        </Button>
        <Button
          data-testid="cancelButton"
          sx={{
            height: '43px !important',
            padding: '0 16px !important',
            minWidth: '130px !important',
          }}
          size="small"
          onClick={cleanFilter}
          disabled={isInitialSearch}
        >
          {t('filter.buttons.clear_filter')}
        </Button>
      </Box>
    </Stack>
  );
};
export default FilterStatistics;
