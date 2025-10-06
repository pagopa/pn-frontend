import { Form, Formik, FormikErrors, FormikProps } from 'formik';
import {
  ChangeEvent,
  ForwardedRef,
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Add, Delete } from '@mui/icons-material';
import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { PhysicalAddressLookup, RecipientType, dataRegex } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import {
  NewNotificationDigitalAddressType,
  NewNotificationRecipient,
  PhysicalAddressLookupConfig,
} from '../../models/NewNotification';
import { useAppDispatch } from '../../redux/hooks';
import { saveRecipients } from '../../redux/newNotification/reducers';
import { getConfiguration } from '../../services/configuration.service';
import {
  denominationLengthAndCharacters,
  identicalTaxIds,
  requiredStringFieldValidation,
  taxIdDependingOnRecipientType,
} from '../../utility/validation.utility';
import FormTextField from './FormTextField';
import NewNotificationCard from './NewNotificationCard';
import { FormBox, FormBoxSubtitle, FormBoxTitle } from './NewNotificationFormElelements';
import PhysicalAddress from './PhysicalAddress';

const initialPhysicalAddress = {
  address: '',
  houseNumber: '',
  addressDetails: '',
  zip: '',
  municipality: '',
  municipalityDetails: '',
  province: '',
  foreignState: 'Italia',
};

const getInitialRecipient = (
  config: PhysicalAddressLookupConfig
): Omit<NewNotificationRecipient, 'id' | 'idx'> => ({
  recipientType: RecipientType.PF,
  taxId: '',
  firstName: '',
  lastName: '',
  type: NewNotificationDigitalAddressType.PEC,
  digitalDomicile: '',
  ...initialPhysicalAddress,
  physicalAddressLookup:
    config === PhysicalAddressLookupConfig.ON
      ? PhysicalAddressLookup.NATIONAL_REGISTRY
      : PhysicalAddressLookup.MANUAL,
});

type FormRecipients = {
  recipients: Array<NewNotificationRecipient>;
};

type Props = {
  onConfirm: () => void;
  onPreviousStep?: () => void;
  recipientsData?: Array<NewNotificationRecipient>;
  forwardedRef: ForwardedRef<unknown>;
};

function conditionalPhysicalAddress(validation: yup.AnySchema): any {
  return yup.string().when('physicalAddressLookup', {
    is: PhysicalAddressLookup.MANUAL,
    then: validation,
    otherwise: yup.string().nullable().notRequired(),
  });
}

const Recipient: React.FC<Props> = ({
  onConfirm,
  onPreviousStep,
  recipientsData,
  forwardedRef,
}) => {
  const { PHYSICAL_ADDRESS_LOOKUP } = getConfiguration();
  const dispatch = useAppDispatch();
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
      : {
          recipients: [
            { ...getInitialRecipient(PHYSICAL_ADDRESS_LOOKUP), idx: 0, id: 'recipient.0' },
          ],
        };

  const buildRecipientValidationObject = () => ({
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
    digitalDomicile: yup
      .string()
      .max(320, tc('too-long-field-error'))
      .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges'))
      .matches(dataRegex.email, t('pec-error')),
    address: conditionalPhysicalAddress(requiredStringFieldValidation(tc, 1024)),
    addressDetails: conditionalPhysicalAddress(
      yup.string().max(1024, tc('too-long-field-error', { maxLength: 1024 }))
    ),
    houseNumber: conditionalPhysicalAddress(
      yup
        .string()
        .required(tc('required-field'))
        .max(1024, tc('too-long-field-error', { maxLength: 1024 }))
    ),
    zip: conditionalPhysicalAddress(
      yup
        .string()
        .required(tc('required-field'))
        .max(12, tc('too-long-field-error', { maxLength: 12 }))
        .matches(dataRegex.zipCode, `${t('zip')} ${tc('invalid')}`)
    ),
    municipalityDetails: conditionalPhysicalAddress(
      yup
        .string()
        .max(256, tc('too-long-field-error', { maxLength: 256 }))
        .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges'))
    ),
    municipality: conditionalPhysicalAddress(requiredStringFieldValidation(tc, 256)),
    province: conditionalPhysicalAddress(requiredStringFieldValidation(tc, 256)),
    foreignState: conditionalPhysicalAddress(requiredStringFieldValidation(tc, 1024)),
    physicalAddressLookup: yup
      .mixed<PhysicalAddressLookup>()
      .oneOf(Object.values(PhysicalAddressLookup)),
  });

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
      }),
  });

  const handleAddRecipient = (values: FormRecipients, setFieldValue: any) => {
    const lastRecipientIdx = values.recipients[values.recipients.length - 1].idx;
    setFieldValue('recipients', [
      ...values.recipients,
      {
        ...getInitialRecipient(PHYSICAL_ADDRESS_LOOKUP),
        idx: lastRecipientIdx + 1,
        id: `recipient.${lastRecipientIdx + 1}`,
      },
    ]);
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
    if (errors?.recipients && errors?.recipients[index]) {
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
  };

  useImperativeHandle(forwardedRef, () => ({
    confirm() {
      dispatch(saveRecipients(formRef.current ? formRef.current.values : { recipients: [] }));
    },
  }));

  const physicalAddressLookupChange = (
    event: ChangeEvent<HTMLInputElement>,
    oldRecipient: NewNotificationRecipient,
    recipientField: string,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    if (PHYSICAL_ADDRESS_LOOKUP !== PhysicalAddressLookupConfig.ON) {
      return;
    }
    setFieldValue(
      recipientField,
      {
        ...oldRecipient,
        ...initialPhysicalAddress,
        physicalAddressLookup: event.target.value,
      },
      true
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSubmit(values)}
      validateOnBlur={false}
      validateOnMount
      // eslint-disable-next-line functional/immutable-data
      innerRef={(form) => (formRef.current = form ?? undefined)}
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
        <Form data-testid="recipientForm">
          <NewNotificationCard
            title={t('title')}
            isContinueDisabled={!isValid}
            previousStepLabel={t('back-to-preliminary-informations')}
            previousStepOnClick={() => handlePreviousStep(values)}
          >
            <Typography variant="body2">{tc('required-fields')}</Typography>
            {values.recipients.map((recipient, index) => (
              <Fragment key={recipient.id}>
                <FormBox testid="RecipientFormBox">
                  {/* Soggetto giuridico */}
                  <Stack direction="row" justifyContent="space-between">
                    <FormBoxTitle text={`${t('legal-entity')}*`} />
                    {values.recipients.length > 1 && (
                      <ButtonNaked
                        data-testid="DeleteRecipientIcon"
                        aria-label={t('remove-recipient')}
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
                        <Delete color="error" />
                      </ButtonNaked>
                    )}
                  </Stack>
                  <Box mt={3} mb={1}>
                    <FormControl>
                      <RadioGroup
                        row
                        defaultValue={RecipientType.PF}
                        name={`recipients[${index}].recipientType`}
                        value={values.recipients[index].recipientType}
                        onChange={(event) =>
                          changeRecipientTypeHandler(event, index, values, setFieldValue)
                        }
                      >
                        <FormControlLabel
                          id="recipient-pf"
                          value={RecipientType.PF}
                          control={<Radio />}
                          name={`recipients[${index}].recipientType`}
                          label={t('physical-person')}
                          data-testid={`recipientType${index}`}
                        />
                        <FormControlLabel
                          id="recipient-pg"
                          value={RecipientType.PG}
                          control={<Radio />}
                          name={`recipients[${index}].recipientType`}
                          label={t('legal-person')}
                          data-testid={`recipientType${index}`}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {/* Codice fiscale e nome */}
                  <Grid container columnSpacing={1} rowSpacing={2} mt={1} mb={2}>
                    <Grid item lg={8} xs={12}>
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
                      />
                    </Grid>
                  </Grid>
                  <Grid container columnSpacing={1} rowSpacing={2}>
                    {values.recipients[index].recipientType === RecipientType.PF && (
                      <>
                        <Grid item xs={12} lg={4}>
                          <FormTextField
                            keyName={`recipients[${index}].firstName`}
                            label={`${t('name')}*`}
                            values={values}
                            touched={touched}
                            errors={errors}
                            setFieldValue={setFieldValue}
                            handleBlur={handleBlur}
                          />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                          <FormTextField
                            keyName={`recipients[${index}].lastName`}
                            label={`${t('surname')}*`}
                            values={values}
                            touched={touched}
                            errors={errors}
                            setFieldValue={setFieldValue}
                            handleBlur={handleBlur}
                          />
                        </Grid>
                      </>
                    )}
                    {values.recipients[index].recipientType === RecipientType.PG && (
                      <Grid item xs={12} lg={8}>
                        <FormTextField
                          keyName={`recipients[${index}].firstName`}
                          label={`${t('business-name')}*`}
                          values={values}
                          touched={touched}
                          errors={errors}
                          setFieldValue={setFieldValue}
                          handleBlur={handleBlur}
                        />
                      </Grid>
                    )}
                  </Grid>

                  {/* Indirizzo */}

                  <FormControl margin="none" fullWidth>
                    <FormLabel
                      id={`recipients[${index}].physicalAddressLabel`}
                      data-testid={`recipients[${index}].physicalAddressLabel`}
                      sx={{ mt: 4 }}
                    >
                      <FormBoxTitle text={t('address')} />
                      {PHYSICAL_ADDRESS_LOOKUP !== PhysicalAddressLookupConfig.OFF && (
                        <FormBoxSubtitle text={t('address-subtitle')} />
                      )}
                    </FormLabel>
                    {PHYSICAL_ADDRESS_LOOKUP === PhysicalAddressLookupConfig.DOWN && (
                      <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        data-testid="alert-physicalAddressLookupDown"
                      >
                        {t('address-physical-lookup-down')}
                      </Alert>
                    )}
                    {PHYSICAL_ADDRESS_LOOKUP !== PhysicalAddressLookupConfig.OFF && (
                      <RadioGroup
                        aria-labelledby={`recipients[${index}].physicalAddressLabel`}
                        name={`recipients[${index}].physicalAddressLookup`}
                        value={values.recipients[index].physicalAddressLookup}
                        onChange={(e) =>
                          physicalAddressLookupChange(
                            e,
                            values.recipients[index],
                            `recipients[${index}]`,
                            setFieldValue
                          )
                        }
                      >
                        <FormControlLabel
                          disabled={PHYSICAL_ADDRESS_LOOKUP === PhysicalAddressLookupConfig.DOWN}
                          value={PhysicalAddressLookup.NATIONAL_REGISTRY}
                          control={<Radio />}
                          label={t('address-physical-lookup-radios.national-registry')}
                          data-testid={`physicalAddressLookupRadio.${index}`}
                        />
                        <FormControlLabel
                          value={PhysicalAddressLookup.MANUAL}
                          control={<Radio />}
                          label={t('address-physical-lookup-radios.manual')}
                          data-testid={`physicalAddressLookupRadio.${index}`}
                        />
                      </RadioGroup>
                    )}
                  </FormControl>

                  {values.recipients[index].physicalAddressLookup ===
                    PhysicalAddressLookup.MANUAL && (
                    <Grid
                      container
                      columnSpacing={1}
                      rowSpacing={2}
                      data-testid={`physicalAddressForm${index}`}
                      sx={{ mt: 2 }}
                    >
                      <PhysicalAddress
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        errors={errors}
                        recipient={index}
                        handleBlur={handleBlur}
                      />
                    </Grid>
                  )}
                  {/* Domicilio digitale */}
                  <Box mt={4} mb={2}>
                    <FormBoxTitle text={t('digital-domicile')} />
                    <FormBoxSubtitle text={t('digital-domicile-subtitle')} />
                  </Box>
                  <Grid container columnSpacing={1} rowSpacing={2}>
                    <Grid item xs={12} lg={6}>
                      <FormTextField
                        keyName={`recipients[${index}].digitalDomicile`}
                        label={`${t('pec-address')}`}
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                      />
                    </Grid>
                  </Grid>
                </FormBox>
                {values.recipients.length < 5 && values.recipients.length - 1 === index && (
                  <Stack mt={2} direction="row" justifyContent="space-between">
                    <ButtonNaked
                      id="add-recipient"
                      startIcon={<Add />}
                      onClick={() => {
                        handleAddRecipient(values, setFieldValue);
                      }}
                      color="primary"
                      disabled={values.recipients.length >= 5}
                      data-testid="add-recipient"
                    >
                      {t('add-recipient')}
                    </ButtonNaked>
                  </Stack>
                )}
              </Fragment>
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
