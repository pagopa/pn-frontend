import _ from 'lodash';
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
  width?: number;
  bornEmpty?: boolean;
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
  bornEmpty = true,
}: Props) => (
  <Grid item xs={width}>
    <TextField
      size="small"
      id={keyName}
      value={_.get(values, keyName)}
      onChange={(event) => {
        setFieldValue(keyName, event.currentTarget.value);
      }}
      onBlur={handleBlur}
      label={label}
      name={keyName}
      error={(!bornEmpty || Boolean(getIn(touched, keyName))) && Boolean(getIn(errors, keyName))}
      helperText={(!bornEmpty || getIn(touched, keyName)) && getIn(errors, keyName)}
      fullWidth
    />
  </Grid>
);

export default FormTextField;