/* eslint-disable sonarjs/no-identical-functions */
import { de, enGB, fr, it, sl } from 'date-fns/locale';

import {
  DesktopDatePicker,
  DesktopDatePickerProps,
  LocalizationProvider,
  MobileDatePicker,
  MobileDatePickerProps,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useIsMobile } from '../hooks';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

const locales: { [key: string]: Locale } = {
  it,
  fr,
  en: enGB,
  de,
  sl,
};

export type DatePickerTypes = Date | null;
const CustomDatePicker = (
  props: (DesktopDatePickerProps<DatePickerTypes> | MobileDatePickerProps<DatePickerTypes>) &
    React.RefAttributes<HTMLDivElement> & { language?: string }
) => {
  const language = props.language ? props.language : 'it';
  const isMobile = useIsMobile();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locales[`${language}`]}>
      {isMobile ? (
        <MobileDatePicker
          {...props}
          localeText={{
            toolbarTitle: '',
            openPreviousView: getLocalizedOrDefaultLabel('common', 'date-picker.left-arrow'),
            openNextView: getLocalizedOrDefaultLabel('common', 'date-picker.right-arrow'),
            calendarViewSwitchingButtonAriaLabel: (view) =>
              view === 'year'
                ? getLocalizedOrDefaultLabel('common', 'date-picker.switch-to-calendar')
                : getLocalizedOrDefaultLabel('common', 'date-picker.switch-to-year'),
            openDatePickerDialogue: (value, utils) => {
              if (value instanceof Date && !isNaN(value.getTime())) {
                const date = utils.format(utils.date(value), 'fullDate');
                return getLocalizedOrDefaultLabel(
                  'common',
                  'date-picker.date-selected',
                  undefined,
                  {
                    date,
                  }
                );
              }
              return getLocalizedOrDefaultLabel('common', 'date-picker.select-date');
            },
          }}
        />
      ) : (
        <DesktopDatePicker
          {...props}
          localeText={{
            openPreviousView: getLocalizedOrDefaultLabel('common', 'date-picker.left-arrow'),
            openNextView: getLocalizedOrDefaultLabel('common', 'date-picker.right-arrow'),
            calendarViewSwitchingButtonAriaLabel: (view) =>
              view === 'year'
                ? getLocalizedOrDefaultLabel('common', 'date-picker.switch-to-calendar')
                : getLocalizedOrDefaultLabel('common', 'date-picker.switch-to-year'),
            openDatePickerDialogue: (value, utils) => {
              if (value instanceof Date && !isNaN(value.getTime())) {
                const date = utils.format(utils.date(value), 'fullDate');
                return getLocalizedOrDefaultLabel(
                  'common',
                  'date-picker.date-selected',
                  undefined,
                  {
                    date,
                  }
                );
              }
              return getLocalizedOrDefaultLabel('common', 'date-picker.select-date');
            },
          }}
        />
      )}
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
