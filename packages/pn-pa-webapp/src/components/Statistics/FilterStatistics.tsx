import { useFormik } from 'formik';
import { isEqual } from 'lodash-es';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, Chip, SxProps } from '@mui/material';
import { Box, Stack } from '@mui/system';
import {
  CustomDatePicker,
  DATE_FORMAT,
  DatePickerTypes,
  clampMax,
  getEndOfDay,
  tenYearsAgo,
  today,
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
import { normalizeStatisticsFilter } from '../../utility/statistics.utility';

const quickFilters = Object.values(SelectedStatisticsFilter).filter((value) => value !== 'custom');

type Props = {
  filter: StatisticsFilter;
  lastDate: Date | null;
  className?: string;
  sx?: SxProps;
};

const FilterStatistics: React.FC<Props> = ({ filter, lastDate, className, sx }) => {
  const { t, i18n } = useTranslation(['statistics']);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  const maxEndDate = getEndOfDay(lastDate ?? today);

  const defaultFilter = normalizeStatisticsFilter(
    { ...filter, selected: SelectedStatisticsFilter.last12Months },
    lastDate
  );

  const validationSchema = yup.object({
    // the formik validations for dates (which control the enable status of the "filtra" button)
    // must coincide with the input field validations (which control the color of the frame around each field)
    startDate: yup.date().min(tenYearsAgo).max(maxEndDate),
    endDate: yup.date().min(yup.ref('startDate')).max(maxEndDate),
    selected: yup
      .mixed<SelectedStatisticsFilterKeys>()
      .oneOf(Object.values(SelectedStatisticsFilter)),
  });

  const formik = useFormik({
    initialValues: {
      startDate: filter.startDate,
      endDate: filter.endDate,
      selected: filter.selected,
    },
    validationSchema,
    enableReinitialize: true,
    /** onSubmit populates filter */
    onSubmit: () => {},
  });

  const applyQuickFilter = (type: SelectedStatisticsFilterKeys) => {
    const next = normalizeStatisticsFilter({ ...filter, selected: type }, lastDate);
    dispatch(setStatisticsFilter(next));
  };

  const applyCustomFilter = () => {
    const next = normalizeStatisticsFilter(
      {
        selected: SelectedStatisticsFilter.custom,
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
      },
      lastDate
    );

    void formik.setValues(next);
    dispatch(setStatisticsFilter(next));
  };

  const cleanFilter = () => {
    void formik.setValues(defaultFilter);
    dispatch(setStatisticsFilter(defaultFilter));
  };

  const isInitialSearch = isEqual(formik.values, defaultFilter);

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
          opacity: `${elem === formik.values.selected ? 0.5 : 1} !important`,
        }}
        disabled={elem === formik.values.selected}
        variant="outlined"
        component="button"
        color={elem === formik.values.selected ? 'primary' : 'default'}
        onClick={() => applyQuickFilter(elem)}
      />
    ));

  return (
    <Stack
      direction={{ xl: 'row', xs: 'column' }}
      mt={4}
      spacing={1}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      data-testid="statistics-filter"
      className={className}
      sx={sx}
    >
      <Box flexGrow={0} flexShrink={0}>
        {quickFiltersJsx()}
      </Box>
      <Box sx={{ display: isMobile ? 'block' : 'flex' }}>
        <CustomDatePicker
          language={i18n.language}
          label={t('filter.from_date')}
          format={DATE_FORMAT}
          value={formik.values.startDate}
          onChange={(value: DatePickerTypes) => {
            void formik.setFieldValue('startDate', value ?? defaultFilter.startDate);
          }}
          slotProps={{
            textField: {
              id: 'startDate',
              name: 'startDate',
              size: 'small',
              inputProps: {
                inputMode: 'text',
                type: 'text',
                'aria-label': t('filter.from_date-input-aria-label'),
              },
              sx: { mb: isMobile ? 1 : 0, mr: 1 },
              fullWidth: isMobile,
            },
          }}
          disableFuture={true}
          minDate={tenYearsAgo}
          maxDate={clampMax(formik.values.endDate, maxEndDate)}
        />
        <CustomDatePicker
          language={i18n.language}
          label={t('filter.to_date')}
          format={DATE_FORMAT}
          value={formik.values.endDate}
          onChange={(value: DatePickerTypes) => {
            void formik.setFieldValue('endDate', value ?? defaultFilter.endDate);
          }}
          slotProps={{
            textField: {
              id: 'endDate',
              name: 'endDate',
              size: 'small',
              inputProps: {
                inputMode: 'text',
                type: 'text',
                'aria-label': t('filter.to_date-input-aria-label'),
              },
              sx: { mb: isMobile ? 1 : 0, mr: 1 },
              fullWidth: isMobile,
            },
          }}
          minDate={formik.values.startDate ?? tenYearsAgo}
          maxDate={maxEndDate}
        />
        <Button
          id="filter-button"
          data-testid="filterButton"
          variant="outlined"
          type="button"
          onClick={applyCustomFilter}
          size="small"
          sx={{
            height: '43px !important',
            mr: 1,
          }}
          disabled={isInitialSearch || !formik.dirty || !formik.isValid}
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
