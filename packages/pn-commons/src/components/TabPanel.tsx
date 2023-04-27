import * as React from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
  index: number;
  value: number;
}
const TabPanel: React.FC<TabPanelProps> = ({ index, value, children }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
  >
    {value === index && <Box sx={{ px: 3, py: 4 }}>{children}</Box>}
  </Box>
);

export default TabPanel;
