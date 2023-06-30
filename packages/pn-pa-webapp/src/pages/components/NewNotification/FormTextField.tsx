import _ from 'lodash';
import { Grid, SxProps, TextField } from '@mui/material';
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
  sx?: SxProps;
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
  sx,
}: Props) => {

  const showErrorIfPresent = Boolean(getIn(touched, keyName) || String(_.get(values, keyName)).length > 0);

  return (
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
        error={showErrorIfPresent && Boolean(getIn(errors, keyName))}
        helperText={showErrorIfPresent && getIn(errors, keyName)}
        fullWidth
        sx={sx}
      />
    </Grid>
  );
};

export default FormTextField;