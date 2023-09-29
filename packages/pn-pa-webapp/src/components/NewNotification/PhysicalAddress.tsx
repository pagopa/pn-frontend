import { useTranslation } from 'react-i18next';
import { FormikErrors, FormikTouched, FormikValues } from 'formik';
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
    { key: 'address', label: `${t('address')}*`, width: 9 },
    { key: 'houseNumber', label: `${t('house-number')}*`, width: 3 },
    { key: 'municipalityDetails', label: t('municipality-details'), width: 6 },
    { key: 'municipality', label: `${t('municipality')}*`, width: 6 },
    { key: 'province', label: `${t('province')}*`, width: 6 },
    { key: 'zip', label: `${t('zip')}*`, width: 6 },
    { key: 'foreignState', label: `${t('foreign-state')}*`, width: 6 },
    { key: 'at', label: t('at'), width: 6 },
    { key: 'addressDetails', label: t('address-details'), width: 12 },
  ];

  return (
    <>
      {physicalAddressFields.map((field) => (
        <FormTextField
          key={field.key}
          keyName={`recipients[${recipient}].${field.key}`}
          label={field.label}
          values={values}
          touched={touched}
          errors={errors}
          setFieldValue={setFieldValue}
          width={field.width}
          handleBlur={handleBlur}
        />
      ))}
    </>
  );
};

export default PhysicalAddress;
