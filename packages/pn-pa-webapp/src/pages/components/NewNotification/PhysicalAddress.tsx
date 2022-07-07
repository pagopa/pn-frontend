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

const physicalAddressFields = [
  { key: 'address', label: 'Indirizzo*', width: 9 },
  { key: 'houseNumber', label: 'Numero civico*', width: 3 },
  { key: 'municipalityDetails', label: 'Località', width: 6 },
  { key: 'municipality', label: 'Comune*', width: 6 },
  { key: 'province', label: 'Provincia*', width: 6 },
  { key: 'zip', label: 'Codice postale*', width: 6 },
  { key: 'foreignState', label: 'Stato*', width: 6 },
  { key: 'addressDetails', label: 'Note aggiuntive (presso, scala, piano)', width: 6 },
  { key: 'at', label: 'Presso', width: 6 },
];

const PhysicalAddress = ({
  values,
  setFieldValue,
  touched,
  errors,
  recipient,
  handleBlur,
}: Props) => (
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

export default PhysicalAddress;
