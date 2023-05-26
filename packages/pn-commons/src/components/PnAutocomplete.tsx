import { Autocomplete, AutocompleteProps, Paper } from '@mui/material';

const PnAutocomplete = <
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>
) => (
  <Autocomplete
    {...props}
    PaperComponent={({ children }) => <Paper elevation={8}>{children}</Paper>}
  />
);

export default PnAutocomplete;
