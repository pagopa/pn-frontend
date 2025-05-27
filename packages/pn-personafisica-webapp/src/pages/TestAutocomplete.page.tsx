import { Box } from '@mui/material';

import MuiItaliaAutocomplete from '../components/MuiItaliaAutocomplete';

const TestAutocomplete = () => (
  <Box display="flex" justifyContent="center" alignItems="center">
    <MuiItaliaAutocomplete
      options={[
        'Milano',
        'Milano Marittima',
        'Milano Centrale',
        'Milano Porta Garibaldi',
        'Milano Porta Romana',
        'Milano Porta Venezia',
        'Milano Cadorna',
        'Milano Garibaldi',
      ]}
      noResultsText="Non abbiamo trovato nulla"
      placeholder="Digita un indirizzo"
      label="Cerca un indirizzo"
      hideArrow
      sx={{ width: '300px', mt: 8 }}
    />
  </Box>
);

export default TestAutocomplete;
