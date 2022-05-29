import DesktopDatePicker, { DesktopDatePickerProps } from "@mui/lab/DesktopDatePicker";

const CustomDatePicker = (props: DesktopDatePickerProps<Date | null> & React.RefAttributes<HTMLDivElement>) => (
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
      if (value) {
        return `Scegli data fine ricerca, la data selezionata è ${utils.format(
          utils.date(value),
          'fullDate'
        )}`;
      }
      return 'Scegli data fine ricerca';
    }}
    // OpenPickerButtonProps={{ 'aria-label': 'Scegli data'}} // props for calendar button
  />
);

export default CustomDatePicker;
