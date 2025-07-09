import { useFormik } from 'formik';
import React, { ChangeEvent, useMemo, useRef } from 'react';
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
  SERCQ_SEND_VALUE,
  TosPrivacyConsent,
  appStateActions,
} from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../navigation/routes.const';
import {
  acceptSercqSendTosPrivacy,
  createOrUpdateAddress,
  getSercqSendTosPrivacyApproval,
} from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const redirectPrivacyLink = () => window.open(`${PRIVACY_POLICY}`, '_blank');
const redirectToSLink = () => window.open(`${TERMS_OF_SERVICE_SERCQ_SEND}`, '_blank');

type Props = {
  goToStep: (step: number) => void;
};

type ContactRecapData = {
  title: string;
  value?: string;
  cta: {
    text: string;
    action: () => void;
  };
};

const SercqSendContactWizard: React.FC<Props> = ({ goToStep }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const tosPrivacy = useRef<Array<TosPrivacyConsent>>();
  const { defaultEMAILAddress, defaultSMSAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const emailSmsStep = 1;
  const thankYouStep = 3;

  const labelPrefix = 'legal-contacts.sercq-send-wizard.step_3.contacts-list';

  const validationSchema = yup.object().shape({
    disclaimer: yup.bool().isTrue(t('required-field', { ns: 'common' })),
  });

  const formik = useFormik({
    initialValues: {
      pec: '',
      disclaimer: false,
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      handleActivation();
    },
  });

  const contactsRecapData: Array<ContactRecapData> = useMemo(
    () => [
      {
        title: t(`${labelPrefix}.email.title`),
        value: defaultEMAILAddress?.value,
        cta: {
          text: t(`${labelPrefix}.email.textDisabled`),
          action: () => goToStep(emailSmsStep),
        },
      },
      {
        title: t(`${labelPrefix}.sms.title`),
        value: defaultSMSAddress?.value,
        cta: {
          text: t(`${labelPrefix}.sms.textDisabled`),
          action: () => goToStep(emailSmsStep),
        },
      },
    ],
    [defaultEMAILAddress?.value, defaultSMSAddress?.value, t]
  );

  const handleActivation = () => {
    dispatch(getSercqSendTosPrivacyApproval())
      .unwrap()
      .then((consent) => {
        // eslint-disable-next-line functional/immutable-data
        tosPrivacy.current = consent;
        handleInfoConfirm();
      })
      .catch(() => {});
  };

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleInfoConfirm = () => {
    if (!tosPrivacy.current) {
      return;
    }
    // first check tos and privacy status
    const [tos, privacy] = tosPrivacy.current.filter(
      (consent) =>
        consent.consentType === ConsentType.TOS_SERCQ ||
        consent.consentType === ConsentType.DATAPRIVACY_SERCQ
    );
    // if tos and privacy are already accepted, proceede with the activation
    if (tos.accepted && privacy.accepted) {
      activateService();
      return;
    }
    // accept tos and privacy
    const tosPrivacyBody = [];
    if (!tos.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: tos.consentVersion,
        type: ConsentType.TOS_SERCQ,
      });
    }
    if (!privacy.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: privacy.consentVersion,
        type: ConsentType.DATAPRIVACY_SERCQ,
      });
    }
    dispatch(acceptSercqSendTosPrivacy(tosPrivacyBody))
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
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`legal-contacts.sercq_send-added-successfully`, { ns: 'recapiti' }),
          })
        );

        goToStep(thankYouStep);
      })
      .catch(() => {});
  };

  return (
    <Box data-testid="sercqSendContactWizard">
      <Typography variant="h6" fontWeight={700} mb={1}>
        {t('legal-contacts.sercq-send-wizard.step_3.title')}
      </Typography>
      <Typography variant="body2" fontSize="14px" mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_3.content')}
      </Typography>
      <Typography variant="body1" fontSize="18px" fontWeight={600}>
        {t('legal-contacts.sercq-send-wizard.step_3.digital-domicile')}
      </Typography>
      <Typography variant="body2" mb={1}>
        {t('legal-contacts.sercq-send-wizard.step_3.send')}
      </Typography>
      <Divider />
      <Typography variant="body2" fontSize="14px" mt={3} mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_3.courtesy-content')}
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
            />
          }
          label={
            <Typography fontSize="14px" color="text.secondary">
              <Trans
                i18nKey="legal-contacts.sercq-send-wizard.step_3.disclaimer"
                ns="recapiti"
                components={[
                  <Link
                    key="privacy-policy"
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'none !important',
                      fontWeight: 'bold',
                    }}
                    onClick={redirectPrivacyLink}
                    data-testid="tos-link"
                  />,

                  <Link
                    key="tos"
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'none !important',
                      fontWeight: 'bold',
                    }}
                    onClick={redirectToSLink}
                    data-testid="tos-link"
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
        onClick={() => formik.submitForm()}
        data-testid="activateButton"
      >
        {t('legal-contacts.sercq-send-wizard.step_3.enable', { ns: 'recapiti' })}
      </Button>
    </Box>
  );
};

export default SercqSendContactWizard;
