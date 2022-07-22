import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
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
import { DigitalDomicileType, fiscalCodeRegex, RecipientType, pIvaRegex } from '@pagopa-pn/pn-commons';

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

const initialValues = {
  recipients: [{ ...singleRecipient, idx: 0, id: 'recipient.0' }],
};

type Props = {
  onConfirm: () => void;
};

const Recipient = ({ onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.recipient',
  });
  const { t: tc } = useTranslation(['common']);

  const validationSchema = yup.object({
    recipients: yup.array().of(
      yup.object({
        firstName: yup.string().required(tc('required-field')),
        lastName: yup.string().required(tc('required-field')),
        taxId: yup
          .string()
          .required(tc('required-field'))
          .matches(fiscalCodeRegex, t('fiscal-code-error')),
        creditorTaxId: yup
          .string()
          .required(tc('required-field'))
          .matches(pIvaRegex, t('fiscal-code-error')),
        noticeCode: yup
          .string()
          .matches(/^\d{18}$/, t('notice-code-error'))
          .required(tc('required-field')),
        digitalDomicile: yup.string().when('showDigitalDomicile', {
          is: true,
          then: yup.string().email(t('pec-error')).required(tc('required-field')),
        }),
        showPhysicalAddress: yup.boolean().isTrue(),
        address: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required(tc('required-field')),
        }),
        houseNumber: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required(tc('required-field')),
        }),
        /*
        addressDetails: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required(tc('required-field')),
        }),
        */
        zip: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required(tc('required-field')),
        }),
        province: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required(tc('required-field')),
        }),
        foreignState: yup.string().when('showPhysicalAddress', {
          is: true,
          then: yup.string().required(tc('required-field')),
        }),
      })
    ),
  });

  const handleAddressTypeChange = (
    event: ChangeEvent,
    oldValue: FormRecipient,
    recipientField: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const checked = (event.target as any).checked;
    const name = (event.target as any).name;
    if (!checked && name.endsWith('showPhysicalAddress')) {
      // reset physical address
      setFieldValue(
        recipientField,
        {
          ...oldValue,
          showPhysicalAddress: false,
          at: '',
          address: '',
          houseNumber: '',
          addressDetails: '',
          zip: '',
          municipality: '',
          municipalityDetails: '',
          province: '',
          foreignState: '',
        },
        false
      );
    }
    if (!checked && name.endsWith('showDigitalDomicile')) {
      // reset digital address
      setFieldValue(
        recipientField,
        {
          ...oldValue,
          showDigitalDomicile: false,
          digitalDomicile: '',
        },
        false
      );
    }
  };

  const handleAddRecipient = (values: { recipients: Array<FormRecipient> }, setFieldValue: any) => {
    const lastRecipientIdx = values.recipients[values.recipients.length - 1].idx;
    setFieldValue('recipients', [
      ...values.recipients,
      { ...singleRecipient, idx: lastRecipientIdx + 1, id: `recipient.${lastRecipientIdx + 1}` },
    ]);
  };

  const handleSubmit = (values: { recipients: Array<FormRecipient> }) => {
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
                    {t('title')} {values.recipients.length > 1 ? index + 1 : null}
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
                    <Typography fontWeight="bold">{t('legal-entity')}*</Typography>
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
                              label={t('physical-person')}
                            />
                          </Grid>
                          {values.recipients[index].recipientType === RecipientType.PF && (
                            <>
                              <FormTextField
                                keyName={`recipients[${index}].firstName`}
                                label={`${t('name')}*`}
                                values={values}
                                touched={touched}
                                errors={errors}
                                setFieldValue={setFieldValue}
                                handleBlur={handleBlur}
                                width={4}
                              />
                              <FormTextField
                                keyName={`recipients[${index}].lastName`}
                                label={`${t('surname')}*`}
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
                            label={t('legal-person')}
                            disabled
                          />
                        </Grid>
                        {values.recipients[index].recipientType === RecipientType.PG && (
                          <FormTextField
                            keyName={`recipients[${index}].firstName`}
                            label={`${t('business-name')}*`}
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
                        label={`${t('recipient-fiscal-code')}*`}
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        width={12}
                      />
                      <FormTextField
                        keyName={`recipients[${index}].creditorTaxId`}
                        label={`${t('creditor-fiscal-code')}*`}
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        width={6}
                      />
                      <FormTextField
                        keyName={`recipients[${index}].noticeCode`}
                        label={`${t('notice-code')}*`}
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
                          <Checkbox
                            checked={values.recipients[index].showDigitalDomicile}
                            name={`recipients[${index}].showDigitalDomicile`}
                            onChange={(digitalCheckEvent) =>
                              handleAddressTypeChange(
                                digitalCheckEvent,
                                values.recipients[index],
                                `recipients[${index}]`,
                                setFieldValue
                              )
                            }
                          />
                          <Typography>{t('add-digital-domicile')}</Typography>
                        </Stack>
                      </Grid>
                      {values.recipients[index].showDigitalDomicile && (
                        <FormTextField
                          keyName={`recipients[${index}].digitalDomicile`}
                          label={`${t('digital-domicile')}*`}
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
                          <Checkbox
                            checked={values.recipients[index].showPhysicalAddress}
                            name={`recipients[${index}].showPhysicalAddress`}
                            onChange={(physicalCheckEvent) =>
                              handleAddressTypeChange(
                                physicalCheckEvent,
                                values.recipients[index],
                                `recipients[${index}]`,
                                setFieldValue
                              )
                            }
                          />
                          <Typography>{t('add-physical-domicile')}*</Typography>
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
                          {t('add-recipient')}
                        </ButtonNaked>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Paper>
            ))}
          </NewNotificationCard>
        </Form>
      )}
    </Formik>
  );
};

export default Recipient;
