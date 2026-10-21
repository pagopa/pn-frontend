import React, { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { Box, Divider, Link, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import {
  ConsentActionType,
  ConsentType,
  SERCQ_SEND_VALUE,
  TosPrivacyConsent,
  appStorage,
} from '@pagopa-pn/pn-commons';
import { MIAlert, MIButton } from '@pagopa/mui-italia';

import { PGEventsType } from '../../models/PGEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import {
  acceptSercqSendTos,
  createOrUpdateAddress,
  getSercqSendTosApproval,
} from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PGEventStrategyFactory from '../../utility/MixpanelUtils/PGEventStrategyFactory';
import SercqSendDisclaimer from './SercqSendDisclaimer';

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

  const tosConsent = useRef<Array<TosPrivacyConsent>>();
  const { defaultEMAILAddress, defaultSMSAddress, defaultPECAddress, defaultSERCQ_SENDAddress } =
    useAppSelector(contactsSelectors.selectAddresses);

  const emailSmsStep = 1;
  const thankYouStep = 3;

  const labelPrefix = 'legal-contacts.sercq-send-wizard.step_3.contacts-list';
  const isDodEnabled = defaultSERCQ_SENDAddress || defaultPECAddress;

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
    dispatch(getSercqSendTosApproval())
      .unwrap()
      .then((consent) => {
        // eslint-disable-next-line functional/immutable-data
        tosConsent.current = consent;
        handleInfoConfirm();
      })
      .catch(() => {});
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
    // accept tos
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
        PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_UX_SUCCESS, {
          digital_domicile_type: ChannelType.SERCQ_SEND,
        });
        PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE, {
          value: ChannelType.SERCQ_SEND,
        });
        appStorage.domicileBanner.enable();
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
                  <CheckCircleRoundedIcon fontSize="small" color="success" aria-hidden="true" />
                ) : (
                  <ErrorRoundedIcon fontSize="small" color="warning" aria-hidden="true" />
                )}
              </Box>
            </Stack>
          </ListItem>
        ))}
      </List>

      <Box sx={{ my: 3 }}>
        <MIAlert severity="info">
          {t('legal-contacts.sercq-send-wizard.step_3.sercq-send-contacts-alert')}
        </MIAlert>
      </Box>

      <SercqSendDisclaimer
        i18nKey={`legal-contacts.sercq-send-wizard.step_3.disclaimer-${
          isDodEnabled ? 'transfer' : 'enable'
        }`}
      />

      <MIButton
        fullWidth
        variant="contained"
        onClick={handleActivation}
        data-testid="activateButton"
      >
        {isDodEnabled
          ? t('button.conferma', { ns: 'common' })
          : t('legal-contacts.sercq-send-wizard.step_3.enable', { ns: 'recapiti' })}
      </MIButton>
    </Box>
  );
};

export default SercqSendContactWizard;
