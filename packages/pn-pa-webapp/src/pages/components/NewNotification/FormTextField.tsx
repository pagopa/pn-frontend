import { Grid, TextField } from '@mui/material';
import { FormikErrors, FormikTouched, FormikValues, getIn } from 'formik';

type Props = {
  keyName: string;
  label: string;
  values: FormikValues;
  touched: FormikTouched<any>;
  errors: FormikErrors<FormikValues>;
  setFieldValue: any;
  handleBlur?: any;
  width: number;
};

const FormTextField = ({
  keyName,
  label,
  values,
  setFieldValue,
  touched,
  errors,
  handleBlur,
  width = 12,
}: Props) => (
  <Grid item xs={width}>
    <TextField
      size="small"
      id={keyName}
      value={values[keyName]}
      onChange={(event) => {
        setFieldValue(keyName, event.currentTarget.value);
      }}
      onBlur={handleBlur}
      label={label}
      name={keyName}
      error={Boolean(getIn(touched, keyName)) && Boolean(getIn(errors, keyName))}
      helperText={getIn(touched, keyName) && getIn(errors, keyName)}
      fullWidth
    />
  </Grid>
);

export default FormTextField;
