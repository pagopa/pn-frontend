import { jsx as _jsx } from "react/jsx-runtime";
import { de, enGB, fr, it, sl } from 'date-fns/locale';
import { DesktopDatePicker, LocalizationProvider, } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';
const locales = {
    it,
    fr,
    en: enGB,
    de,
    sl,
};
const CustomDatePicker = (props) => {
    const language = props.language ? props.language : 'it';
    return (_jsx(LocalizationProvider, { dateAdapter: AdapterDateFns, adapterLocale: locales[`${language}`], children: _jsx(DesktopDatePicker, { ...props, leftArrowButtonText: getLocalizedOrDefaultLabel('common', 'date-picker.left-arrow', 'Vai al mese precedente'), rightArrowButtonText: getLocalizedOrDefaultLabel('common', 'date-picker.right-arrow', 'Vai al mese successivo'), getViewSwitchingButtonText: (view) => view === 'year'
                ? getLocalizedOrDefaultLabel('common', 'date-picker.switch-to-calendar', "modalità di scelta dell'anno attiva, passa alla modalità calendario")
                : getLocalizedOrDefaultLabel('common', 'date-picker.switch-to-year', "modalità calendario attiva, passa alla modalità di scelta dell'anno"), getOpenDialogAriaText: (value, utils) => {
                if (value instanceof Date && !isNaN(value.getTime())) {
                    const date = utils.format(utils.date(value), 'fullDate');
                    return getLocalizedOrDefaultLabel('common', 'date-picker.date-selected', `Scegli data, la data selezionata è ${date}`, {
                        date,
                    });
                }
                return getLocalizedOrDefaultLabel('common', 'date-picker.select-date', 'Scegli data');
            } }) }));
};
export default CustomDatePicker;
