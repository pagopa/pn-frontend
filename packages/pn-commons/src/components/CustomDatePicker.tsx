import { de, enGB, fr, it, sl } from 'date-fns/locale';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';

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
  props: DesktopDatePickerProps<DatePickerTypes, DatePickerTypes> &
    React.RefAttributes<HTMLDivElement> & { language?: string }
) => {
  const language = props.language ? props.language : 'it';
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locales[`${language}`]}>
      <DesktopDatePicker
        {...props}
        leftArrowButtonText={getLocalizedOrDefaultLabel(
          'common',
          'date-picker.left-arrow',
          'Vai al mese precedente'
        )} // deprecated
        rightArrowButtonText={getLocalizedOrDefaultLabel(
          'common',
          'date-picker.right-arrow',
          'Vai al mese successivo'
        )} // deprecated
        getViewSwitchingButtonText={(view) =>
          view === 'year'
            ? getLocalizedOrDefaultLabel(
                'common',
                'date-picker.switch-to-calendar',
                "modalità di scelta dell'anno attiva, passa alla modalità calendario"
              )
            : getLocalizedOrDefaultLabel(
                'common',
                'date-picker.switch-to-year',
                "modalità calendario attiva, passa alla modalità di scelta dell'anno"
              )
        }
        getOpenDialogAriaText={(value, utils) => {
          if (value instanceof Date && !isNaN(value.getTime())) {
            const date = utils.format(utils.date(value), 'fullDate');
            return getLocalizedOrDefaultLabel(
              'common',
              'date-picker.date-selected',
              `Scegli data, la data selezionata è ${date}`,
              {
                date,
              }
            );
          }
          return getLocalizedOrDefaultLabel('common', 'date-picker.select-date', 'Scegli data');
        }}
        // OpenPickerButtonProps={{ 'aria-label': 'Scegli data'}} // props for calendar button
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
