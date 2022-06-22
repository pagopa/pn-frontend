import { Add, Delete } from '@mui/icons-material';
import {
  FormControl,
  Stack,
  Typography,
  RadioGroup,
  Grid,
  Radio,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { DigitalDomicileType, fiscalCodeRegex, RecipientType } from '@pagopa-pn/pn-commons';

import { pIvaRegex } from '@pagopa-pn/pn-commons/src/utils/fiscal_code.utility';
import { saveRecipients } from '../../../redux/newNotification/actions';
import { useAppDispatch } from '../../../redux/hooks';
import { FormRecipient } from '../../../models/NewNotification';
import PhysicalAddress from './PhysicalAddress';
import FormTextField from './FormTextField';
import NewNotificationCard from './NewNotificationCard';

const singleRecipient = {
  recipientType: RecipientType.PF,
  taxId: '',
  creditorTaxId: '',
  noticeCode: '',
  firstName: '',
  lastName: '',
  type: DigitalDomicileType.PEC,
  digitalDomicile: '',
  at: '',
  address: '',
  houseNumber: '',
  addressDetails: '',
  zip: '',
  municipality: '',
  municipalityDetails: '',
  province: '',
  foreignState: '',
  showDigitalDomicile: false,
  showPhysicalAddress: false,
};

type Props = {
  onConfirm: () => void;
};

const Recipient = ({ onConfirm }: Props) => {
  const dispatch = useAppDispatch();

  const initialValues = {
    recipients: [{ ...singleRecipient, idx: 0, id: 'recipient.0' }],
  };

  const validationSchema = yup.object({
    recipients: yup.array().of(
      yup.object({
        firstName: yup.string().required('Campo obbligatorio'),
        lastName: yup.string().required('Campo obbligatorio'),
        taxId: yup
          .string()
          .required('Campo obbligatorio')
          .matches(fiscalCodeRegex, 'Il codice fiscale inserito non è corretto'),
        creditorTaxId: yup
          .string()
          .required('Campo obbligatorio')
          .matches(pIvaRegex, 'Il codice fiscale inserito non è corretto'),
        noticeCode: yup.string().required('Campo obbligatorio'),
        address: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
        houseNumber: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
        /*
        addressDetails: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
        */
        zip: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
        province: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
        foreignState: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
      })
    ),
  });

  const handleAddRecipient = (values: {recipients: Array<FormRecipient>}, setFieldValue: any) => {
    const lastRecipientIdx = values.recipients[values.recipients.length - 1].idx;
    setFieldValue('recipients', [
      ...values.recipients,
      { ...singleRecipient, idx: lastRecipientIdx + 1, id: `recipient.${lastRecipientIdx + 1}` },
    ]);
  };

  const handleSubmit = (values: {recipients: Array<FormRecipient>}) => {
    dispatch(saveRecipients(values));
    onConfirm();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
      validateOnBlur={false}
      validateOnMount
    >
      {({ values, setFieldValue, touched, handleBlur, errors, isValid }) => (
        <>
          <Form>
            <NewNotificationCard noPaper isContinueDisabled={!isValid}>
              {values.recipients.map((recipient, index) => (
                <Paper
                  key={recipient.id}
                  sx={{ padding: '24px', marginTop: '40px' }}
                  className="paperContainer"
                >
                  <Stack
                    display="flex"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">
                      Destinatario {values.recipients.length > 1 ? index + 1 : null}
                    </Typography>
                    {values.recipients.length > 1 && (
                      <Delete
                        data-testid="DeleteRecipientIcon"
                        onClick={() => {
                          setFieldValue(
                            'recipients',
                            values.recipients.filter((_, j) => index !== j)
                          );
                        }}
                      />
                    )}
                  </Stack>
                  <Box sx={{ marginTop: '20px' }}>
                    <Stack>
                      <Typography fontWeight="bold">Soggetto giuridico*</Typography>
                      <FormControl sx={{ width: '100%' }}>
                        <RadioGroup
                          aria-labelledby="radio-buttons-group-pf-pg"
                          defaultValue={RecipientType.PF}
                          name={`recipients[${index}].recipientType`}
                          value={values.recipients[index].recipientType}
                          onChange={(event) => {
                            setFieldValue(
                              'selectPersonaFisicaOrPersonaGiuridica',
                              event.currentTarget.value
                            );
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={4}>
                              <FormControlLabel
                                value={RecipientType.PF}
                                control={<Radio />}
                                name={`recipients[${index}].recipientType`}
                                label={'Persona fisica'}
                              />
                            </Grid>
                            {values.recipients[index].recipientType === RecipientType.PF && (
                              <>
                                <FormTextField
                                  keyName={`recipients[${index}].firstName`}
                                  label={'Nome*'}
                                  values={values}
                                  touched={touched}
                                  errors={errors}
                                  setFieldValue={setFieldValue}
                                  handleBlur={handleBlur}
                                  width={4}
                                />
                                <FormTextField
                                  keyName={`recipients[${index}].lastName`}
                                  label={'Cognome*'}
                                  values={values}
                                  touched={touched}
                                  errors={errors}
                                  setFieldValue={setFieldValue}
                                  handleBlur={handleBlur}
                                  width={4}
                                />
                              </>
                            )}
                          </Grid>
                        </RadioGroup>
                        <Grid container sx={{ width: '100%' }}>
                          <Grid item xs={4}>
                            <FormControlLabel
                              value={RecipientType.PG}
                              control={<Radio />}
                              name={`recipients[${index}].recipientType`}
                              label={'Persona giuridica'}
                              disabled
                            />
                          </Grid>
                          {values.recipients[index].recipientType === RecipientType.PG && (
                            <FormTextField
                              keyName={`recipients[${index}].firstName`}
                              label={'Ragione sociale*'}
                              values={values}
                              touched={touched}
                              errors={errors}
                              setFieldValue={setFieldValue}
                              handleBlur={handleBlur}
                              width={8}
                            />
                          )}
                        </Grid>
                      </FormControl>
                      <Grid container spacing={2} mt={2}>
                        <FormTextField
                          keyName={`recipients[${index}].taxId`}
                          label={'Codice fiscale destinatario*'}
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          width={12}
                        />
                        <FormTextField
                          keyName={`recipients[${index}].creditorTaxId`}
                          label={'Codice fiscale ente creditore*'}
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          width={6}
                        />
                        <FormTextField
                          keyName={`recipients[${index}].noticeCode`}
                          label={'Codice avviso*'}
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          width={6}
                        />
                        <Grid
                          item
                          xs={6}
                          data-testid="DigitalDomicileCheckbox"
                          onClick={() =>
                            setFieldValue(
                              `recipients[${index}].showDigitalDomicile`,
                              !values.recipients[index].showDigitalDomicile
                            )
                          }
                        >
                          <Stack display="flex" direction="row" alignItems="center">
                            <Checkbox checked={values.recipients[index].showDigitalDomicile} />
                            <Typography>Aggiungi un domicilio digitale</Typography>
                          </Stack>
                        </Grid>
                        {values.recipients[index].showDigitalDomicile && (
                          <FormTextField
                            keyName={`recipients[${index}].digitalDomicile`}
                            label={'Domicilio digitale'}
                            values={values}
                            touched={touched}
                            errors={errors}
                            setFieldValue={setFieldValue}
                            handleBlur={handleBlur}
                            width={6}
                          />
                        )}
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid
                          xs={12}
                          item
                          data-testid="PhysicalAddressCheckbox"
                          onClick={() =>
                            setFieldValue(
                              `recipients[${index}].showPhysicalAddress`,
                              !values.recipients[index].showPhysicalAddress
                            )
                          }
                        >
                          <Stack display="flex" direction="row" alignItems="center">
                            <Checkbox checked={values.recipients[index].showPhysicalAddress} />
                            <Typography>Aggiungi un indirizzo fisico</Typography>
                          </Stack>
                        </Grid>
                        {values.recipients[index].showPhysicalAddress && (
                          <PhysicalAddress
                            values={values}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            errors={errors}
                            recipient={index}
                            handleBlur={handleBlur}
                          />
                        )}
                      </Grid>
                      {values.recipients.length - 1 === index && (
                        <Stack mt={4} display="flex" direction="row" justifyContent="space-between">
                          <ButtonNaked
                            startIcon={<Add />}
                            onClick={() => {
                              handleAddRecipient(values, setFieldValue);
                            }}
                            color="primary"
                            size="large"
                          >
                            Aggiungi un destinatario
                          </ButtonNaked>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </Paper>
              ))}
            </NewNotificationCard>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default Recipient;
