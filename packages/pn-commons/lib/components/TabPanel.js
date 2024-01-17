import { jsx as _jsx } from "react/jsx-runtime";
import Box from '@mui/material/Box';
const TabPanel = ({ index, value, children }) => (_jsx(Box, { role: "tabpanel", hidden: value !== index, id: `simple-tabpanel-${index}`, "aria-labelledby": `simple-tab-${index}`, children: value === index && _jsx(Box, { sx: { px: 3, py: 4 }, children: children }) }));
export default TabPanel;
