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
  { key: 'at', label: 'Presso', width: 6 },
  { key: 'foreignState', label: 'Stato*', width: 6 },
  { key: 'address', label: 'Via*', width: 9 },
  { key: 'houseNumber', label: 'Numero civico*', width: 3 },
  { key: 'zip', label: 'Codice postale*', width: 6 },
  { key: 'municipality', label: 'Comune*', width: 6 },
  { key: 'municipalityDetails', label: 'Frazione', width: 6 },
  { key: 'province', label: 'Provincia*', width: 6 },
  { key: 'addressDetails', label: 'Altre informazioni (scala, piano)', width: 12 },
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
