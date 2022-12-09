import { ChangeEvent, ReactNode } from 'react';
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
import { DigitalDomicileType, RecipientType, dataRegex } from '@pagopa-pn/pn-commons';

import { saveRecipients } from '../../../redux/newNotification/reducers';
import { useAppDispatch } from '../../../redux/hooks';
import { NewNotificationRecipient, PaymentModel } from '../../../models/NewNotification';
import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import { getDuplicateValuesByKeys } from '../../../utils/notification.utility';
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
  paymentMode: PaymentModel | undefined;
  onConfirm: () => void;
  onPreviousStep?: () => void;
  recipientsData?: Array<NewNotificationRecipient>;
};

const Recipient = ({ paymentMode, onConfirm, onPreviousStep, recipientsData }: Props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.recipient',
  });
  const { t: tc } = useTranslation(['common']);
  // TODO all validation code shoduld be put in a different file in order to make this file more readable
  // moreover cross-validation between form items is resulting in bad input performance
  const initialValues =
    recipientsData && recipientsData.length > 0
      ? {
          recipients: recipientsData.map((recipient, index) => ({
            ...recipient,
            idx: index,
            id: `recipient.${index}`,
          })),
        }
      : { recipients: [{ ...singleRecipient, idx: 0, id: 'recipient.0' }] };

  const buildRecipientValidationObject = () => {
    const validationObject = {
      recipientType: yup.string(),
      // validazione sulla denominazione (firstName + " " + lastName per PF, firstName per PG)
      // la lunghezza non può superare i 80 caratteri
      firstName: yup
        .string()
        .required(tc('required-field'))
        .test({
          name: 'denominationTotalLength',
          test(value) {
            const denomination = (value || '') + ((this.parent.lastName as string) || '');
            if (dataRegex.denomination.test(denomination)) {
              return true;
            }
            // il messaggio di "denominazione troppo lunga" è diverso a seconda che sia PF o PG
            const messageKey = `too-long-denomination-error-${this.parent.recipientType || 'PF'}`;
            return this.createError({ message: t(messageKey), path: this.path });
          },
        }),
      // la validazione di lastName è condizionale perché per persone giuridiche questo attributo
      // non viene richiesto
      lastName: yup.string().when('recipientType', {
        is: (value: string) => value !== RecipientType.PG,
        then: yup.string().required(tc('required-field')),
      }),
      taxId: yup
        .string()
        .required(tc('required-field'))
        // validazione su CF: deve accettare solo formato a 16 caratteri per PF, e sia 16 sia 11 caratteri per PG
        .test('taxIdDependingOnRecipientType', t('fiscal-code-error'), function (value) {
          if (!value) {
            return true;
          }
          const isCF16 = dataRegex.fiscalCode.test(value);
          const isCF11 = dataRegex.pIva.test(value);
          return isCF16 || (this.parent.recipientType === RecipientType.PG && isCF11);
        }),
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
      municipality: yup.string().when('showPhysicalAddress', {
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
    };

    if (paymentMode !== PaymentModel.NOTHING) {
      return {
        ...validationObject,
        // .matches(dataRegex.fiscalCode, t('fiscal-code-error')),
        creditorTaxId: yup
          .string()
          .required(tc('required-field'))
          .matches(dataRegex.pIva, t('fiscal-code-error')),
        noticeCode: yup
          .string()
          .matches(dataRegex.noticeCode, t('notice-code-error'))
          .required(tc('required-field')),
      };
    }

    return validationObject;
  };

  const validationSchema = yup.object({
    recipients: yup
      .array()
      .of(yup.object(buildRecipientValidationObject()))
      .test('identicalTaxIds', t('identical-fiscal-codes-error'), (values) => {
        if (values) {
          const duplicatesTaxIds = getDuplicateValuesByKeys(values, ['taxId']);
          if (duplicatesTaxIds.length > 0) {
            const errors: string | yup.ValidationError | Array<yup.ValidationError> = [];
            values.forEach((value, i) => {
              if (value.taxId && duplicatesTaxIds.includes(value.taxId)) {
                // eslint-disable-next-line functional/immutable-data
                errors.push(
                  new yup.ValidationError(
                    t('identical-fiscal-codes-error'),
                    value,
                    `recipients[${i}].taxId`
                  )
                );
              }
            });
            return errors.length === 0 ? true : new yup.ValidationError(errors);
          } else {
            return true;
          }
        }
        return true;
      })
      // TODO the form needs some typing definition (any should not be allowed)
      // here we have any because we add or remove creditorTaxId and noticeCode to the form based on the chosen paymentModel
      .test('identicalIUV', t('identical-fiscal-codes-error'), (values: any) => {
        if (values && paymentMode !== PaymentModel.NOTHING) {
          const duplicateIUVs = getDuplicateValuesByKeys(values, ['creditorTaxId', 'noticeCode']);
          if (duplicateIUVs.length > 0) {
            const errors: string | yup.ValidationError | Array<yup.ValidationError> = [];
            values.forEach((value: { creditorTaxId: string; noticeCode: string }, i: number) => {
              if (
                value.creditorTaxId &&
                value.noticeCode &&
                duplicateIUVs.includes(value.creditorTaxId + value.noticeCode)
              ) {
                // eslint-disable-next-line functional/immutable-data
                errors.push(
                  new yup.ValidationError(
                    t('identical-notice-codes-error'),
                    value,
                    `recipients[${i}].noticeCode`
                  ),
                  new yup.ValidationError(' ', value, `recipients[${i}].creditorTaxId`)
                );
              }
            });
            return errors.length === 0 ? true : new yup.ValidationError(errors);
          } else {
            return true;
          }
        } else {
          return true;
        }
      }),
  });

  const handleAddressTypeChange = (
    event: ChangeEvent,
    oldValue: NewNotificationRecipient,
    recipientField: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const checked = (event.target as any).checked;
    const name = (event.target as any).name;
    if (checked) {
      trackEventByType(
        name.endsWith('showPhysicalAddress')
          ? TrackEventType.NOTIFICATION_SEND_PHYSICAL_ADDRESS
          : TrackEventType.NOTIFICATION_SEND_DIGITAL_DOMICILE
      );
    }
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

  const handleAddRecipient = (
    values: { recipients: Array<NewNotificationRecipient> },
    setFieldValue: any
  ) => {
    const lastRecipientIdx = values.recipients[values.recipients.length - 1].idx;
    setFieldValue('recipients', [
      ...values.recipients,
      { ...singleRecipient, idx: lastRecipientIdx + 1, id: `recipient.${lastRecipientIdx + 1}` },
    ]);
    trackEventByType(TrackEventType.NOTIFICATION_SEND_MULTIPLE_RECIPIENTS, {
      recipients: lastRecipientIdx + 1,
    });
  };

  const handleSubmit = (values: { recipients: Array<NewNotificationRecipient> }) => {
    dispatch(saveRecipients(values));
    onConfirm();
  };

  const handlePreviousStep = (values: { recipients: Array<NewNotificationRecipient> }) => {
    dispatch(saveRecipients(values));
    if (onPreviousStep) {
      onPreviousStep();
    }
  };

  const paymentReferenceData = (data: ReactNode) =>
    paymentMode === PaymentModel.NOTHING ? '' : data;

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
      validateOnBlur={false}
      validateOnMount
    >
      {({
        values,
        setFieldValue,
        touched,
        setFieldTouched,
        handleBlur,
        errors,
        isValid /* setValues */,
      }) => (
        <Form>
          <NewNotificationCard
            noPaper
            isContinueDisabled={!isValid}
            previousStepLabel={t('back-to-preliminary-informations')}
            previousStepOnClick={() => handlePreviousStep(values)}
          >
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
                        if (errors && errors.recipients && errors.recipients[index]) {
                          setFieldTouched(`recipients.${index}`, false, false);
                        }
                        setFieldValue(
                          'recipients',
                          values.recipients.filter((_, j) => index !== j),
                          true
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
                          const valuesToUpdate: {
                            recipientType: RecipientType;
                            firstName: string;
                            lastName?: string;
                          } = {
                            recipientType: event.currentTarget.value as RecipientType,
                            firstName: '',
                          };
                          if (event.currentTarget.value === RecipientType.PG) {
                            /* eslint-disable-next-line functional/immutable-data */
                            valuesToUpdate.lastName = '';
                          }

                          // I take profit that any level in the value structure can be used in setFieldValue ...
                          setFieldValue(`recipients[${index}]`, {
                            ...values.recipients[index],
                            ...valuesToUpdate,
                          });
                          // In fact, I would have liked to specify the change through a function, i.e.
                          //   setFieldValue(`recipients[${index}]`, (currentValue: any) => ({...currentValue, ...valuesToUpdate}));
                          // but unfortunately Formik' setFieldValue is not capable of handling such kind of updates.

                          trackEventByType(TrackEventType.NOTIFICATION_SEND_RECIPIENT_TYPE, {
                            type: event.currentTarget.value,
                          });
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
                      </RadioGroup>
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
                      {paymentReferenceData(
                        <>
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
                        </>
                      )}
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
