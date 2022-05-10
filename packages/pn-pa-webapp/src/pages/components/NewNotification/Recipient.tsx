import { useNavigate } from 'react-router-dom';
import { Add, Delete } from '@mui/icons-material';
import { Fragment } from 'react';
import {
  FormControl,
  Stack,
  Typography,
  RadioGroup,
  Grid,
  Radio,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import * as yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import { DigitalDomicileType, fiscalCodeRegex, RecipientType } from '@pagopa-pn/pn-commons';

import { saveRecipients } from '../../../redux/newNotification/actions';
import { useAppDispatch } from '../../../redux/hooks';
import PhysicalAddress from './PhysicalAddress';
import FormTextField from './FormTextField';

const oneRecipient = {
  recipientType: RecipientType.PF,
  taxId: '',
  creditorTaxId: '',
  noticeCode: '',
  firstName: '',
  lastName: '',
  type: 'PEC',
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
  token: '',
};

const Recipient = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const initialValues = {
    recipients: [
      {
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
        token: '',
        showDigitalDomicile: false,
        showPhysicalAddress: false,
      },
    ],
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
          .matches(fiscalCodeRegex, 'Il codice fiscale inserito non è corretto'),
        noticeCode: yup.string().required('Campo obbligatorio'),
        address: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
        houseNumber: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
        addressDetails: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required('Campo obbligatorio'),
        }),
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

  const handleSubmit = (values: FormikValues) => {
    dispatch(saveRecipients(values));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Fragment>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleSubmit(values)}
        validateOnBlur={false}
      >
        {({ values, setFieldValue, touched, handleBlur, errors }) => (
          <>
            <Form>
              {Array.from(Array(values.recipients.length).keys()).map((recipient) => (
                <Paper
                  key={recipient}
                  sx={{ padding: '24px', marginTop: '40px' }}
                  className="paperContainer"
                >
                  <Stack
                    display="flex"
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="h6">Destinatario {recipient + 1}</Typography>
                    {values.recipients.length > 1 && (
                      <Delete
                        onClick={() => {
                          setFieldValue(
                            'recipients',
                            values.recipients.filter((_, index) => index !== recipient)
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
                          name={`recipients[${recipient}].recipientType`}
                          value={values.recipients[recipient].recipientType}
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
                                name={`recipients[${recipient}].recipientType`}
                                label={'Persona Fisica'}
                              />
                            </Grid>
                            {values.recipients[recipient].recipientType === RecipientType.PF && (
                              <>
                                <FormTextField
                                  keyName={`recipients[${recipient}].firstName`}
                                  label={'Nome*'}
                                  values={values}
                                  touched={touched}
                                  errors={errors}
                                  setFieldValue={setFieldValue}
                                  handleBlur={handleBlur}
                                  width={4}
                                />
                                <FormTextField
                                  keyName={`recipients[${recipient}].lastName`}
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
                              name={`recipients[${recipient}].recipientType`}
                              label={'Persona giuridica'}
                              disabled
                            />
                          </Grid>
                          {values.recipients[recipient].recipientType === RecipientType.PG && (
                            <FormTextField
                              keyName={`recipients[${recipient}].firstName`}
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
                          keyName={`recipients[${recipient}].taxId`}
                          label={'Codice fiscale destinatario*'}
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          width={12}
                        />
                        <FormTextField
                          keyName={`recipients[${recipient}].creditorTaxId`}
                          label={'Codice fiscale Ente Creditore*'}
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                          width={6}
                        />
                        <FormTextField
                          keyName={`recipients[${recipient}].noticeCode`}
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
                          onClick={() =>
                            setFieldValue(
                              `recipients[${recipient}].showDigitalDomicile`,
                              !values.recipients[recipient].showDigitalDomicile
                            )
                          }
                        >
                          <Stack display="flex" direction="row" alignItems="center">
                            <Checkbox checked={values.recipients[recipient].showDigitalDomicile} />
                            <Typography>Aggiungi un domicilio digitale</Typography>
                          </Stack>
                        </Grid>
                        {values.recipients[recipient].showDigitalDomicile && (
                          <FormTextField
                            keyName={`recipients[${recipient}].digitalDomicile`}
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
                          onClick={() =>
                            setFieldValue(
                              `recipients[${recipient}].showPhysicalAddress`,
                              !values.recipients[recipient].showPhysicalAddress
                            )
                          }
                        >
                          <Stack display="flex" direction="row" alignItems="center">
                            <Checkbox checked={values.recipients[recipient].showPhysicalAddress} />
                            <Typography>Aggiungi un indirizzo fisico</Typography>
                          </Stack>
                        </Grid>
                        {values.recipients[recipient].showPhysicalAddress && (
                          <PhysicalAddress
                            values={values}
                            setFieldValue={setFieldValue}
                            touched={touched}
                            errors={errors}
                            recipient={recipient}
                            handleBlur={handleBlur}
                          />
                        )}
                      </Grid>
                      {values.recipients.length - 1 === recipient && (
                        <Stack display="flex" direction="row" justifyContent="space-between">
                          <ButtonNaked
                            startIcon={<Add />}
                            onClick={() => {
                              setFieldValue('recipients', [...values.recipients, oneRecipient]);
                            }}
                            color="primary"
                            size="large"
                            mt={4}
                          >
                            Aggiungi un destinatario
                          </ButtonNaked>
                        </Stack>
                      )}
                    </Stack>
                  </Box>
                </Paper>
              ))}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginTop: '40px', marginBottom: '20px' }}
              >
                <Button variant="outlined" type="button" onClick={handleGoBack}>
                  Torna alle notifiche
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={Object.keys(touched).length === 0 || Object.keys(errors).length > 0}
                >
                  Continua
                </Button>
              </Box>
            </Form>
          </>
        )}
      </Formik>
    </Fragment>
  );
};

export default Recipient;
