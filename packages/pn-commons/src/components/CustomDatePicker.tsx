import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';

export type DatePickerTypes = Date | null;

const CustomDatePicker = (
  props: DesktopDatePickerProps<DatePickerTypes, DatePickerTypes> &
    React.RefAttributes<HTMLDivElement>
) => (
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
);

export default CustomDatePicker;
