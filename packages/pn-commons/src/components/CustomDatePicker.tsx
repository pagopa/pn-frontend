import { de, enGB, fr, it, sl } from 'date-fns/locale';

import {
  DesktopDatePicker,
  DesktopDatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

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
  props: DesktopDatePickerProps<DatePickerTypes> &
    React.RefAttributes<HTMLDivElement> & { language?: string }
) => {
  const language = props.language ? props.language : 'it';
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locales[`${language}`]}>
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
              return getLocalizedOrDefaultLabel('common', 'date-picker.date-selected', undefined, {
                date,
              });
            }
            return getLocalizedOrDefaultLabel('common', 'date-picker.select-date');
          },
        }}
        // OpenPickerButtonProps={{ 'aria-label': 'Scegli data'}} // props for calendar button
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
