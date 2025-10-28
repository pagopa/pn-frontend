import { useFormik } from 'formik';
import React, { ChangeEvent, useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import {
  ConsentActionType,
  ConsentType,
  EventAction,
  SERCQ_SEND_VALUE,
  TosPrivacyConsent,
} from '@pagopa-pn/pn-commons';
import { theme } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  IOAllowedValues,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../navigation/routes.const';
import {
  acceptSercqSendTos,
  createOrUpdateAddress,
  getSercqSendTosApproval,
} from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { isPFEvent } from '../../utility/mixpanel';

type Props = {
  goToStep: (step: number) => void;
  showIOStep?: boolean;
};

type ContactRecapData = {
  title: string;
  value?: string;
  cta: {
    text: string;
    action: () => void;
  };
};

const SercqSendContactWizard: React.FC<Props> = ({ goToStep, showIOStep }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const tosConsent = useRef<Array<TosPrivacyConsent>>();
  const { courtesyAddresses, defaultEMAILAddress, defaultAPPIOAddress, defaultSMSAddress } =
    useAppSelector(contactsSelectors.selectAddresses);

  const isIOInstalled = !!defaultAPPIOAddress;

  const normalizedShowIOStep = showIOStep ?? false;

  const ioStep = normalizedShowIOStep ? 1 : 0;
  const emailSmsStep = ioStep + 1;
  const thankYouStep = ioStep + 3;

  const labelPrefix = 'legal-contacts.sercq-send-wizard.step_4.contacts-list';

  const validationSchema = yup.object().shape({
    disclaimer: yup.bool().isTrue(t('required-field', { ns: 'common' })),
  });

  const formik = useFormik({
    initialValues: {
      disclaimer: false,
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      handleActivation();
    },
  });

  const handleGoToStep = (channelType: ChannelType) => {
    if (channelType === ChannelType.IOMSG) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_GO_TO_APP_IO);
      goToStep(ioStep);
    } else {
      const eventKey = `SEND_ADD_SERCQ_SEND_GO_TO_${channelType}`;
      if (isPFEvent(eventKey)) {
        PFEventStrategyFactory.triggerEvent(PFEventsType[eventKey]);
      }
      goToStep(emailSmsStep);
    }
  };

  const contactsRecapData: Array<ContactRecapData> = useMemo(() => {
    const contacts: Array<ContactRecapData | null> = [
      {
        title: t(`${labelPrefix}.email.title`),
        value: defaultEMAILAddress?.value,
        cta: {
          text: t(`${labelPrefix}.email.textDisabled`),
          action: () => handleGoToStep(ChannelType.EMAIL),
        },
      },
      isIOInstalled
        ? {
            title: t(`${labelPrefix}.io.title`),
            value:
              defaultAPPIOAddress?.value === IOAllowedValues.ENABLED
                ? t(`${labelPrefix}.io.textEnabled`)
                : undefined,
            cta: {
              text: t(`${labelPrefix}.io.textDisabled`),
              action: () => handleGoToStep(ChannelType.IOMSG),
            },
          }
        : null,
      {
        title: t(`${labelPrefix}.sms.title`),
        value: defaultSMSAddress?.value,
        cta: {
          text: t(`${labelPrefix}.sms.textDisabled`),
          action: () => handleGoToStep(ChannelType.SMS),
        },
      },
    ];

    return contacts.filter((c): c is ContactRecapData => c !== null);
  }, [
    defaultEMAILAddress?.value,
    defaultAPPIOAddress?.value,
    defaultSMSAddress?.value,
    normalizedShowIOStep,
    t,
  ]);

  const handleSubmitForm = async () => {
    const errors = formik.errors;

    if (errors?.disclaimer) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_TOS_MANDATORY);
    }

    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_UX_CONVERSION, {
      tos_validation: errors?.disclaimer ? 'missing' : 'valid',
    });

    await formik.submitForm();
  };

  const handleActivation = () => {
    dispatch(getSercqSendTosApproval())
      .unwrap()
      .then((consent) => {
        // eslint-disable-next-line functional/immutable-data
        tosConsent.current = consent;
        handleInfoConfirm();
      })
      .catch(() => {});
  };

  const handleChangeTouched = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'disclaimer') {
      const event = e.target.checked
        ? PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_TOS_ACCEPTED
        : PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY_TOS_DISMISSED;
      PFEventStrategyFactory.triggerEvent(event);
    }

    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleInfoConfirm = () => {
    if (!tosConsent.current) {
      return;
    }
    // first check tos status
    const [tos] = tosConsent.current.filter(
      (consent) => consent.consentType === ConsentType.TOS_SERCQ
    );

    // if tos are already accepted, proceede with the activation
    if (tos.accepted) {
      activateService();
      return;
    }

    const tosBody = !tos.accepted
      ? [
          {
            action: ConsentActionType.ACCEPT,
            version: tos.consentVersion,
            type: ConsentType.TOS_SERCQ,
          },
        ]
      : [];

    dispatch(acceptSercqSendTos(tosBody))
      .unwrap()
      .then(() => {
        activateService();
      })
      .catch(() => {});
  };

  const activateService = () => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: 'default',
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
    };
    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then(() => {
        sessionStorage.removeItem('domicileBannerClosed');
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_UX_SUCCESS, {
          sercq_type: ChannelType.SERCQ_SEND,
          contacts: courtesyAddresses,
        });
        goToStep(thankYouStep);
      })
      .catch(() => {});
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_SUMMARY, {
      event_type: EventAction.SCREEN_VIEW,
      contacts: courtesyAddresses,
    });
  }, []);

  return (
    <Box data-testid="sercqSendContactWizard">
      <Typography variant="h6" fontWeight={700} mb={1}>
        {t('legal-contacts.sercq-send-wizard.step_4.title')}
      </Typography>
      <Typography variant="body2" fontSize="14px" mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_4.content')}
      </Typography>
      <Typography variant="body1" fontSize="18px" fontWeight={600}>
        {t('legal-contacts.sercq-send-wizard.step_4.digital-domicile')}
      </Typography>
      <Typography variant="body2" mb={1}>
        {t('legal-contacts.sercq-send-wizard.step_4.send')}
      </Typography>
      <Divider />
      <Typography variant="body2" fontSize="14px" mt={3} mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_4.courtesy-content')}
      </Typography>
      <List dense sx={{ p: 0 }} data-testid="sercq-send-contacts-list">
        {contactsRecapData.map((item) => (
          <ListItem key={item.title} sx={{ px: 0, py: 1 }} divider>
            <Stack width="100%">
              <Typography variant="body1" fontWeight={600}>
                {item.title}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <ListItemText>
                  {item.value ? (
                    <Typography variant="body2">{item.value}</Typography>
                  ) : (
                    <Link
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'none !important',
                        fontWeight: 'bold',
                      }}
                      onClick={item.cta.action}
                      data-testid="backToContactStep"
                    >
                      {item.cta.text}
                    </Link>
                  )}
                </ListItemText>
                {item.value ? (
                  <CheckCircleIcon fontSize="small" color="success" aria-hidden="true" />
                ) : (
                  <ErrorIcon fontSize="small" color="warning" aria-hidden="true" />
                )}
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>

      <FormControl sx={{ my: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              name="disclaimer"
              id="disclaimer"
              // required
              onChange={handleChangeTouched}
              inputProps={{
                'aria-describedby': 'disclaimer-helper-text',
                'aria-invalid': formik.touched.disclaimer && Boolean(formik.errors.disclaimer),
              }}
              sx={{
                color:
                  formik.touched.disclaimer && Boolean(formik.errors.disclaimer)
                    ? theme.palette.error.dark
                    : theme.palette.text.secondary,
              }}
            />
          }
          label={
            <Typography fontSize="14px" color="text.secondary">
              <Trans
                i18nKey="legal-contacts.sercq-send-wizard.step_4.disclaimer"
                ns="recapiti"
                components={[
                  <Link
                    key="privacy-policy"
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'none !important',
                      fontWeight: 'bold',
                    }}
                    data-testid="privacy-link"
                    href={PRIVACY_POLICY}
                    target="_blank"
                    rel="noopener"
                  />,

                  <Link
                    key="tos"
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'none !important',
                      fontWeight: 'bold',
                    }}
                    data-testid="tos-link"
                    href={TERMS_OF_SERVICE_SERCQ_SEND}
                    target="_blank"
                    rel="noopener"
                  />,
                ]}
              />
            </Typography>
          }
          sx={{ alignItems: 'center' }}
          value={formik.values.disclaimer}
        />
        {formik.touched.disclaimer && Boolean(formik.errors.disclaimer) && (
          <FormHelperText id="disclaimer-helper-text" error>
            {formik.errors.disclaimer}
          </FormHelperText>
        )}
      </FormControl>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmitForm}
        data-testid="activateButton"
      >
        {t('legal-contacts.sercq-send-wizard.step_4.enable', { ns: 'recapiti' })}
      </Button>
    </Box>
  );
};

export default SercqSendContactWizard;
