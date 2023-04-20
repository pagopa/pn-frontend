import * as React from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
  index: number;
  value: number;
}
const TabPanel: React.FC<TabPanelProps> = ({ index, value, children }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

export default TabPanel;
