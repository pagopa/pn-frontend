import { Button, Stack, TextField, TextFieldProps, Typography } from '@mui/material';
import { WithRequired } from '@pagopa-pn/pn-commons';

type Props = {
  label: string;
  inputProps: WithRequired<Exclude<TextFieldProps, 'label'>, 'id'>;
  insertDisabled: boolean;
  buttonLabel: string;
};

const InsertDigitalContact: React.FC<Props> = ({
  label,
  inputProps,
  insertDisabled,
  buttonLabel,
}) => (
  <>
    <Typography id={`${inputProps.id}-label`} variant="body2" mb={1} sx={{ fontWeight: 'bold' }}>
      {label}
    </Typography>
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        inputProps={{ sx: { height: '14px' } }}
        fullWidth
        sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
        {...inputProps}
      />

      <Button
        id={`${inputProps.id}-button`}
        variant="outlined"
        disabled={insertDisabled}
        fullWidth
        type="submit"
        data-testid={`${inputProps.id}-button`}
        sx={{ flexBasis: { xs: 'unset', lg: '33.33%' } }}
      >
        {buttonLabel}
      </Button>
    </Stack>
  </>
);
export default InsertDigitalContact;
