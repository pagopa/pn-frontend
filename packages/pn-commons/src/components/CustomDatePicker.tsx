import { DesktopDatePicker, DesktopDatePickerProps } from "@mui/x-date-pickers/DesktopDatePicker";

export type DatePickerTypes = Date | null;

const CustomDatePicker = (props: DesktopDatePickerProps<DatePickerTypes, DatePickerTypes> & React.RefAttributes<HTMLDivElement>) => (
  <DesktopDatePicker
    {...props}
    leftArrowButtonText="Vai al mese precedente" // deprecated
    rightArrowButtonText="Vai al mese successivo" // deprecated
    getViewSwitchingButtonText={(view) =>
      view === 'year'
        ? "modalità di scelta dell'anno attiva, passa alla modalità calendario"
        : "modalità calendario attiva, passa alla modalità di scelta dell'anno"
    }
    getOpenDialogAriaText={(value, utils) => {
      if (value instanceof Date && !isNaN(value.getTime())) {
        return `Scegli data, la data selezionata è ${utils.format(
          utils.date(value),
          "fullDate"
        )}`;
      }
      return 'Scegli data';
    }}
    // OpenPickerButtonProps={{ 'aria-label': 'Scegli data'}} // props for calendar button
  />
);

export default CustomDatePicker;
