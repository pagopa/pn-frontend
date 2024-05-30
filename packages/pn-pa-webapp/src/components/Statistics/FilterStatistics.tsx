import { FormikValues, useFormik } from 'formik';
import _ from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, Chip } from '@mui/material';
import {
  CustomDatePicker,
  DATE_FORMAT,
  DatePickerTypes,
  dateIsDefined,
  filtersApplied,
  formatToSlicedISOString,
  oneMonthAgo,
  oneYearAgo,
  sixMonthsAgo,
  tenYearsAgo,
  threeMonthsAgo,
  today,
  twelveMonthsAgo,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import {
  SelectedStatisticsFilter,
  SelectedStatisticsFilterKeys,
  StatisticsFilter,
} from '../../models/Statistics';
import { useAppDispatch } from '../../redux/hooks';
import { setStatisticsFilter } from '../../redux/statistics/reducers';

const emptyValues = {
  startDate: tenYearsAgo,
  endDate: today,
  selected: null,
};

const initialEmptyValues = { ...emptyValues, selected: SelectedStatisticsFilter.lastMonth };

const initialValues = (filter: StatisticsFilter | null): FormikValues => {
  if (!filter || _.isEqual(filter, emptyValues)) {
    return initialEmptyValues;
  }
  return {
    startDate: new Date(filter.startDate),
    endDate: new Date(filter.endDate),
    selected: filter.selected,
  };
};

type Props = {
  filter: StatisticsFilter | null;
};

const FilterStatistics: React.FC<Props> = ({ filter }) => {
  console.log('=============== FilterStatistics Render!');
  const { t, i18n } = useTranslation(['statistics']);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const [prevFilter, setPrevFilter] = useState(filter || emptyValues);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
    onSubmit: (values: FormikValues) => {
      const currentFilter = {
        startDate: formatToSlicedISOString(values.startDate),
        endDate: formatToSlicedISOString(values.endDate),
        selected: values.selected,
      };
      if (_.isEqual(prevFilter, currentFilter)) {
        return;
      }
      dispatch(setStatisticsFilter(currentFilter));
      setPrevFilter(currentFilter);
    },
  });

  const setFilter = (type: SelectedStatisticsFilterKeys): void => {
    const vals = {
      endDate: today,
      selected: type,
    };
    switch (type) {
      case SelectedStatisticsFilter.lastMonth:
        formik
          .setValues({
            ...vals,
            startDate: oneMonthAgo,
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          });
        break;
      case SelectedStatisticsFilter.last3Months:
        formik
          .setValues({
            ...vals,
            startDate: threeMonthsAgo,
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          });
        break;
      case SelectedStatisticsFilter.last6Months:
        formik
          .setValues({
            ...vals,
            startDate: sixMonthsAgo,
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          });
        break;
      case SelectedStatisticsFilter.last12Months:
        formik
          .setValues({
            ...vals,
            startDate: twelveMonthsAgo,
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          });
        break;
      default:
        formik
          .setValues({
            selected: null,
            startDate: oneYearAgo,
            endDate: today,
          })
          .catch((error) => {
            console.log(`Error: ${error}`);
          });
    }
  };

  const handleSelectFilter = async (type: SelectedStatisticsFilterKeys) => {
    setFilter(type);
    console.log('========== handleSelecteFilter');
    formik.submitForm().catch((error) => console.log(`Error submitting form: ${error}`));
  };

  const cleanFilter = () => {
    console.log('=============== FilterStatistics - cleanFilter()');
    dispatch(setStatisticsFilter(emptyValues));
  };

  const isInitialSearch = _.isEqual(formik.values, initialEmptyValues);

  return (
    <>
      <Chip
        key="lastMonth"
        label={t('filter.lastMonth')}
        sx={{ mr: 1 }}
        variant="outlined"
        component="button"
        color={
          formik.values.selected === SelectedStatisticsFilter.lastMonth ? 'primary' : 'default'
        }
        onClick={() => handleSelectFilter(SelectedStatisticsFilter.lastMonth)}
      />
      <Chip
        key="last3Months"
        label={t('filter.last3Months')}
        sx={{ mr: 1 }}
        variant="outlined"
        component="button"
        color={
          formik.values.selected === SelectedStatisticsFilter.last3Months ? 'primary' : 'default'
        }
        onClick={() => handleSelectFilter(SelectedStatisticsFilter.last3Months)}
      />
      <Chip
        key="last6Months"
        label={t('filter.last6Months')}
        sx={{ mr: 1 }}
        variant="outlined"
        component="button"
        color={
          formik.values.selected === SelectedStatisticsFilter.last6Months ? 'primary' : 'default'
        }
        onClick={() => handleSelectFilter(SelectedStatisticsFilter.last6Months)}
      />
      <Chip
        key="last12Months"
        label={t('filter.last12Months')}
        sx={{ mr: 1 }}
        variant="outlined"
        component="button"
        color={
          formik.values.selected === SelectedStatisticsFilter.last12Months ? 'primary' : 'default'
        }
        onClick={() => handleSelectFilter(SelectedStatisticsFilter.last12Months)}
      />
      <CustomDatePicker
        language={i18n.language}
        label={t('filter.from_date')}
        format={DATE_FORMAT}
        value={startDate}
        onChange={(value: DatePickerTypes) => {
          void formik.setFieldValue('startDate', value || oneMonthAgo).then(() => {
            setStartDate(value);
          });
        }}
        slotProps={{
          textField: {
            id: 'startDate',
            name: 'startDate',
            size: 'small',
            'aria-label': t('filter.from_date-aria-label'), // aria-label for (TextField + Button) Group
            inputProps: {
              inputMode: 'text',
              placeholder: 'gg/mm/aaaa',
              type: 'text',
              'aria-label': t('filter.from_date-input-aria-label'),
            },
            fullWidth: isMobile,
            sx: { marginBottom: isMobile ? '20px' : '0' },
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
          void formik.setFieldValue('endDate', value || today).then(() => {
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
            fullWidth: isMobile,
            sx: { marginBottom: isMobile ? '20px' : '0' },
          },
        }}
        disableFuture={true}
        minDate={startDate ?? tenYearsAgo}
      />
      <Button
        id="filter-button"
        data-testid="filterButton"
        variant="outlined"
        type="submit"
        size="small"
        sx={{
          height: '43px !important',
          marginRight: '8px !important',
        }}
        disabled={isInitialSearch && !filtersApplied}
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
        disabled={!filtersApplied}
      >
        {t('filter.buttons.clear_filter')}
      </Button>
    </>
  );
};
export default FilterStatistics;
