import { de, enGB, fr, it, sl } from 'date-fns/locale';

import { DatePicker, DatePickerProps, LocalizationProvider } from '@mui/x-date-pickers';
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
  props: DatePickerProps<DatePickerTypes> &
    React.RefAttributes<HTMLDivElement> & { language?: string }
) => {
  const language = props.language ? props.language : 'it';
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locales[`${language}`]}>
      <DatePicker
        {...props}
        slotProps={{
          ...props.slotProps,
          toolbar: { hidden: true },
          actionBar: { actions: [] },
          layout: { className: 'PnDatePicker' }, // don't remove it! it is used for tests
        }}
        closeOnSelect
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
        data-testid="ciao"
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
