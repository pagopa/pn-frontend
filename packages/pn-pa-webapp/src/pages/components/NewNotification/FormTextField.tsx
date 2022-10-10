import { Grid, TextField } from '@mui/material';
import { FormikErrors, FormikTouched, FormikValues, getIn } from 'formik';
// import { useEffect, useState } from 'react';

type Props = {
  keyName: string;
  label: string;
  values: FormikValues;
  touched: FormikTouched<any>;
  errors: FormikErrors<FormikValues>;
  setFieldValue: any;
  handleBlur?: any;
  width?: number;
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
}: Props) => {

  // const [fakeValue, setFakeValue] = useState(undefined);

  // useEffect(() => {
  //   setFakeValue(undefined);
  // }, []);

  // if (keyName === 'recipients[0].firstName') {
  //   console.log('showing the firstName field');
  //   console.log({ currentValue: values[keyName], allValues: values });
  // }

  if (keyName === 'toto') {
    console.log('this should never happen, added just to avoid a silly error');
  }
  return <Grid item xs={width}>
    <TextField
      size="small"
      id={keyName}
      value={values[keyName]}
      // value={fakeValue}
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
  </Grid>;
};

export default FormTextField;
