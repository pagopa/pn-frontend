import { FormikErrors, FormikTouched, FormikValues } from 'formik';
import { useTranslation } from 'react-i18next';

import { Grid } from '@mui/material';

import FormTextField from './FormTextField';

type Props = {
  values: FormikValues;
  touched: FormikTouched<FormikValues>;
  errors: FormikErrors<FormikValues>;
  setFieldValue: any;
  recipient: number;
  handleBlur?: any;
};

const PhysicalAddress = ({
  values,
  setFieldValue,
  touched,
  errors,
  recipient,
  handleBlur,
}: Props) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.recipient',
  });

  const physicalAddressFields = [
    { key: 'foreignState', label: t('foreign-state'), width: 4, required: true },
    { key: 'province', label: t('province'), width: 4, required: true },
    { key: 'zip', label: t('zip'), width: 4, required: true },
    { key: 'municipality', label: t('municipality'), width: 6, required: true },
    { key: 'municipalityDetails', label: t('municipality-details'), width: 6 },
    { key: 'address', label: t('address'), width: 9, required: true },
    { key: 'houseNumber', label: t('house-number'), width: 3, required: true },
    { key: 'addressDetails', label: t('address-details'), width: 12 },
  ];

  return (
    <>
      {physicalAddressFields.map((field) => (
        <Grid item xs={12} lg={field.width} key={field.key}>
          <FormTextField
            keyName={`recipients[${recipient}].${field.key}`}
            label={field.label}
            required={field.required}
            values={values}
            touched={touched}
            errors={errors}
            setFieldValue={setFieldValue}
            handleBlur={handleBlur}
          />
        </Grid>
      ))}
    </>
  );
};

export default PhysicalAddress;
