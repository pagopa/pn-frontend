import { ChangeEvent, ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik, Form, FormikProps, FormikErrors } from 'formik';
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
import {
  DigitalDomicileType,
  RecipientType,
  dataRegex,
  SectionHeading,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { saveRecipients } from '../../../redux/newNotification/reducers';
import { useAppDispatch } from '../../../redux/hooks';
import { NewNotificationRecipient, PaymentModel } from '../../../models/NewNotification';
import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import PhysicalAddress from './PhysicalAddress';
import FormTextField from './FormTextField';
import NewNotificationCard from './NewNotificationCard';
import {
  denominationLengthAndCharacters,
  identicalIUV,
  identicalTaxIds,
  taxIdDependingOnRecipientType,
} from './Recipient.validations';
import { requiredStringFieldValidation } from './validation.utility';

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

type FormRecipients = {
  recipients: Array<NewNotificationRecipient>;
};

type Props = {
  paymentMode: PaymentModel | undefined;
  onConfirm: () => void;
  onPreviousStep?: () => void;
  recipientsData?: Array<NewNotificationRecipient>;
  forwardedRef: ForwardedRef<unknown>;
};

const Recipient = ({
  paymentMode,
  onConfirm,
  onPreviousStep,
  recipientsData,
  forwardedRef,
}: Props) => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.recipient',
  });
  const { t: tc } = useTranslation(['common']);
  const formRef = useRef<FormikProps<FormRecipients>>();
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
      firstName: requiredStringFieldValidation(tc).test({
        name: 'denominationLengthAndCharacters',
        test(value?: string) {
          const error = denominationLengthAndCharacters(value, this.parent.lastName);
          if (error) {
            return this.createError({
              message:
                error.messageKey === 'too-long-field-error'
                  ? tc(error.messageKey, error.data)
                  : t(error.messageKey, error.data),
              path: this.path,
            });
          }
          return true;
        },
      }),
      // la validazione di lastName è condizionale perché per persone giuridiche questo attributo
      // non viene richiesto
      lastName: yup.string().when('recipientType', {
        is: (value: string) => value !== RecipientType.PG,
        then: requiredStringFieldValidation(tc).test({
          name: 'denominationLengthAndCharacters',
          test(value?: string) {
            const error = denominationLengthAndCharacters(this.parent.firstName, value as string);
            if (error) {
              return this.createError({
                message: ' ',
                path: this.path,
              });
            }
            return true;
          },
        }),
      }),
      taxId: yup
        .string()
        .required(tc('required-field'))
        // validazione su CF: deve accettare solo formato a 16 caratteri per PF, e sia 16 sia 11 caratteri per PG
        .test('taxIdDependingOnRecipientType', t('fiscal-code-error'), function (value) {
          return taxIdDependingOnRecipientType(value, this.parent.recipientType);
        }),
      digitalDomicile: yup.string().when('showDigitalDomicile', {
        is: true,
        then: requiredStringFieldValidation(tc, 320).matches(dataRegex.email, t('pec-error')),
      }),
      showPhysicalAddress: yup.boolean().isTrue(),
      address: yup.string().when('showPhysicalAddress', {
        is: true,
        then: requiredStringFieldValidation(tc, 1024),
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
        then: requiredStringFieldValidation(tc, 12),
      }),
      municipalityDetails: yup.string().when('showPhysicalAddress', {
        is: true,
        then: yup
          .string()
          .max(256, tc('too-long-field-error', { maxLength: 256 }))
          .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges')),
      }),
      municipality: yup.string().when('showPhysicalAddress', {
        is: true,
        then: requiredStringFieldValidation(tc, 256),
      }),
      province: yup.string().when('showPhysicalAddress', {
        is: true,
        then: requiredStringFieldValidation(tc, 256),
      }),
      foreignState: yup.string().when('showPhysicalAddress', {
        is: true,
        then: requiredStringFieldValidation(tc),
      }),
    };

    if (paymentMode !== PaymentModel.NOTHING) {
      return {
        ...validationObject,
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
        const errors = identicalTaxIds(values as Array<NewNotificationRecipient> | undefined);
        if (errors.length === 0) {
          return true;
        }
        return new yup.ValidationError(
          errors.map((e) => new yup.ValidationError(t(e.messageKey), e.value, e.id))
        );
      })
      .test('identicalIUV', t('identical-fiscal-codes-error'), (values) => {
        const errors = identicalIUV(
          values as Array<NewNotificationRecipient> | undefined,
          paymentMode
        );
        if (errors.length === 0) {
          return true;
        }
        return new yup.ValidationError(
          errors.map(
            (e) => new yup.ValidationError(e.messageKey ? t(e.messageKey) : '', e.value, e.id)
          )
        );
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

  const handleAddRecipient = (values: FormRecipients, setFieldValue: any) => {
    const lastRecipientIdx = values.recipients[values.recipients.length - 1].idx;
    setFieldValue('recipients', [
      ...values.recipients,
      { ...singleRecipient, idx: lastRecipientIdx + 1, id: `recipient.${lastRecipientIdx + 1}` },
    ]);
    trackEventByType(TrackEventType.NOTIFICATION_SEND_MULTIPLE_RECIPIENTS, {
      recipients: lastRecipientIdx + 1,
    });
  };

  const handleSubmit = (values: FormRecipients) => {
    dispatch(saveRecipients(values));
    onConfirm();
  };

  const handlePreviousStep = (values: FormRecipients) => {
    dispatch(saveRecipients(values));
    if (onPreviousStep) {
      onPreviousStep();
    }
  };

  const deleteRecipientHandler = (
    errors: FormikErrors<FormRecipients>,
    index: number,
    values: FormRecipients,
    setFieldTouched: (
      field: string,
      isTouched?: boolean | undefined,
      shouldValidate?: boolean | undefined
    ) => void,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
  ) => {
    if (errors && errors.recipients && errors.recipients[index]) {
      setFieldTouched(`recipients.${index}`, false, false);
    }
    setFieldValue(
      'recipients',
      values.recipients.filter((_, j) => index !== j),
      true
    );
  };

  const changeRecipientTypeHandler = (
    event: any,
    index: number,
    values: FormRecipients,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void
  ) => {
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
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      dispatch(saveRecipients(formRef.current ? formRef.current.values : { recipients: [] }));
    },
  }));

  /**
   * @param mobileValue value used in mobile mode
   * @param desktopValue value used in desktop mode
   * @returns It returns desktopValue or mobileValue, depending on device width.
   */
  const setValueByDevice = (mobileValue: number, desktopValue: number): number =>
    isMobile ? mobileValue : desktopValue;

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
      validateOnBlur={false}
      validateOnMount
      // eslint-disable-next-line functional/immutable-data
      innerRef={(form) => (formRef.current = form || undefined)}
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
                  <SectionHeading>
                    {t('title')} {values.recipients.length > 1 ? index + 1 : null}
                  </SectionHeading>
                  {values.recipients.length > 1 && (
                    <ButtonNaked
                      data-testid="DeleteRecipientIcon"
                      aria-label={t('new-notification.steps.remove-recipient')}
                      onClick={() =>
                        deleteRecipientHandler(
                          errors,
                          index,
                          values,
                          setFieldTouched,
                          setFieldValue
                        )
                      }
                    >
                      <Delete />
                    </ButtonNaked>
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
                        onChange={(event) =>
                          changeRecipientTypeHandler(event, index, values, setFieldValue)
                        }
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={setValueByDevice(12, 4)}>
                            <FormControlLabel
                              value={RecipientType.PF}
                              control={<Radio />}
                              name={`recipients[${index}].recipientType`}
                              label={t('physical-person')}
                            />
                            <FormControlLabel
                              value={RecipientType.PG}
                              control={<Radio />}
                              name={`recipients[${index}].recipientType`}
                              label={t('legal-person')}
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
                                width={setValueByDevice(12, 4)}
                              />
                              <FormTextField
                                keyName={`recipients[${index}].lastName`}
                                label={`${t('surname')}*`}
                                values={values}
                                touched={touched}
                                errors={errors}
                                setFieldValue={setFieldValue}
                                handleBlur={handleBlur}
                                width={setValueByDevice(12, 4)}
                              />
                            </>
                          )}
                          {values.recipients[index].recipientType === RecipientType.PG && (
                            <FormTextField
                              keyName={`recipients[${index}].firstName`}
                              label={`${t('business-name')}*`}
                              values={values}
                              touched={touched}
                              errors={errors}
                              setFieldValue={setFieldValue}
                              handleBlur={handleBlur}
                              width={setValueByDevice(12, 8)}
                              sx={{ mt: setValueByDevice(0, 6) }}
                            />
                          )}
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                    <Grid container spacing={2} mt={setValueByDevice(0, 2)}>
                      <FormTextField
                        keyName={`recipients[${index}].taxId`}
                        label={`${t(
                          values.recipients[index].recipientType === RecipientType.PG
                            ? 'recipient-organization-tax-id'
                            : 'recipient-citizen-tax-id'
                        )}*`}
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        width={12}
                      />
                      {paymentMode !== PaymentModel.NOTHING && (
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
                        xs={setValueByDevice(12, 6)}
                        data-testid="DigitalDomicileCheckbox"
                        onClick={(e) => {
                          setFieldValue(
                            `recipients[${index}].showDigitalDomicile`,
                            !values.recipients[index].showDigitalDomicile
                          );
                          e.preventDefault(); // avoids issue with non clickable checkbox label in FormControlLabel
                        }}
                      >
                        <FormControlLabel
                          checked={values.recipients[index].showDigitalDomicile}
                          control={
                            <Checkbox
                              onChange={(digitalCheckEvent) =>
                                handleAddressTypeChange(
                                  digitalCheckEvent as ChangeEvent,
                                  values.recipients[index],
                                  `recipients[${index}]`,
                                  setFieldValue
                                )
                              }
                            />
                          }
                          name={`recipients[${index}].showDigitalDomicile`}
                          label={t('add-digital-domicile')}
                        />
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
                          width={setValueByDevice(12, 6)}
                        />
                      )}
                    </Grid>
                    <Grid container>
                      <Grid
                        xs={12}
                        item
                        data-testid="PhysicalAddressCheckbox"
                        onClick={(e) => {
                          setFieldValue(
                            `recipients[${index}].showPhysicalAddress`,
                            !values.recipients[index].showPhysicalAddress
                          );
                          e.preventDefault(); // avoids issue with non clickable checkbox label in FormControlLabel
                        }}
                      >
                        <FormControlLabel
                          checked={values.recipients[index].showPhysicalAddress}
                          control={
                            <Checkbox
                              onChange={(physicalCheckEvent) =>
                                handleAddressTypeChange(
                                  physicalCheckEvent as ChangeEvent,
                                  values.recipients[index],
                                  `recipients[${index}]`,
                                  setFieldValue
                                )
                              }
                            />
                          }
                          name={`recipients[${index}].showPhysicalAddress`}
                          label={`${t('add-physical-domicile')}*`}
                        />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1}>
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
                    {values.recipients.length < 5 && values.recipients.length - 1 === index && (
                      <Stack mt={4} display="flex" direction="row" justifyContent="space-between">
                        <ButtonNaked
                          startIcon={<Add />}
                          onClick={() => {
                            handleAddRecipient(values, setFieldValue);
                          }}
                          color="primary"
                          size="large"
                          disabled={values.recipients.length >= 5}
                          data-testid="add-recipient"
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

// This is a workaorund to prevent cognitive complexity warning
export default forwardRef((props: Omit<Props, 'forwardedRef'>, ref) => (
  <Recipient {...props} forwardedRef={ref} />
));
