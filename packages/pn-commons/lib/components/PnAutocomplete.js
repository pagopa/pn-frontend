import { jsx as _jsx } from "react/jsx-runtime";
import { Autocomplete, Paper } from '@mui/material';
const PnAutocomplete = (props) => (_jsx(Autocomplete, { ...props, openText: props.openText || "", closeText: props.closeText || "", PaperComponent: ({ children }) => _jsx(Paper, { elevation: 8, children: children }) }));
export default PnAutocomplete;
