import { useFormik } from 'formik';
import React, { ChangeEvent, useRef } from 'react';
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
  IconButton,
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

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  IOAllowedValues,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../navigation/routes.const';
import {
  acceptSercqSendTosPrivacy,
  createOrUpdateAddress,
  getSercqSendTosPrivacyApproval,
} from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

const redirectPrivacyLink = () => window.open(`${PRIVACY_POLICY}`, '_blank');
const redirectToSLink = () => window.open(`${TERMS_OF_SERVICE_SERCQ_SEND}`, '_blank');

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

  const tosPrivacy = useRef<Array<TosPrivacyConsent>>();
  const { defaultPECAddress, defaultEMAILAddress, defaultAPPIOAddress, defaultSMSAddress } =
    useAppSelector(contactsSelectors.selectAddresses);
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);

  const normalizedShowIOStep = showIOStep ?? false;

  const ioStep = normalizedShowIOStep ? 1 : 0;
  const emailSmsStep = ioStep + 1;
  const thankYouStep = ioStep + 3;

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

  const sercqSendContactsList: Array<{
    title: string;
    textDisabled: string;
    textEnabled?: string;
  }> = t('legal-contacts.sercq-send-wizard.step_4.contacts-list', {
    returnObjects: true,
    defaultValue: [],
  });

  const getContactsRecapData = (): Array<ContactRecapData> => {
    const contacts: Array<ContactRecapData | null> = [
      {
        title: sercqSendContactsList[0].title,
        value: defaultEMAILAddress?.value,
        cta: {
          text: sercqSendContactsList[0].textDisabled,
          action: () => goToStep(emailSmsStep),
        },
      },
      normalizedShowIOStep
        ? {
            title: sercqSendContactsList[1].title,
            value:
              defaultAPPIOAddress?.value === IOAllowedValues.ENABLED
                ? sercqSendContactsList[1].textEnabled
                : undefined,
            cta: {
              text: sercqSendContactsList[1].textDisabled,
              action: () => goToStep(ioStep),
            },
          }
        : null,
      {
        title: sercqSendContactsList[2].title,
        value: defaultSMSAddress?.value,
        cta: {
          text: sercqSendContactsList[2].textDisabled,
          action: () => goToStep(emailSmsStep),
        },
      },
    ];

    return contacts.filter((c): c is ContactRecapData => c !== null);
  };

  const handleActivation = () => {
    dispatch(getSercqSendTosPrivacyApproval())
      .unwrap()
      .then((consent) => {
        // eslint-disable-next-line functional/immutable-data
        tosPrivacy.current = consent;
        const source = externalEvent?.source ?? ContactSource.RECAPITI;
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_START, {
          senderId: 'default',
          source,
        });
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
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_UX_CONVERSION, 'default');
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
        PFEventStrategyFactory.triggerEvent(
          PFEventsType.SEND_ADD_SERCQ_SEND_UX_SUCCESS,
          !!defaultPECAddress
        );
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
      <>
        <List dense sx={{ p: 0 }} data-testid="sercq-send-contacts-list">
          {getContactsRecapData().map((item) => (
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
                      >
                        {item.cta.text}
                      </Link>
                    )}
                  </ListItemText>
                  <IconButton size="small">
                    {item.value ? (
                      <CheckCircleIcon fontSize="small" color="success" />
                    ) : (
                      <ErrorIcon fontSize="small" color="warning" />
                    )}
                  </IconButton>
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
          {t('button.enable', { ns: 'common' })}
        </Button>
      </>
    </Box>
  );
};

export default SercqSendContactWizard;
