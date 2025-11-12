import React from 'react';
import { useTranslation } from 'react-i18next';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Chip, ChipProps, Paper, Stack, Typography } from '@mui/material';
import { EventAction } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { ChannelType } from '../../models/contacts';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

export enum DigitalDomicileManagementAction {
  DEFAULT = 'DEFAULT',
  ADD_SPECIAL_CONTACT = 'ADD_SPECIAL_CONTACT',
  DIGITAL_DOMICILE_TRANSFER = 'DIGITAL_DOMICILE_TRANSFER',
}

type Props = {
  setAction: (action: DigitalDomicileManagementAction) => void;
};

type DigitalDomicileOption = {
  title: string;
  content: string;
  action: {
    text: string;
    callback: () => void;
  };
};

const DigitalDomicileOption: React.FC<DigitalDomicileOption> = ({ title, content, action }) => (
  <Stack flexBasis="100%" p={2} bgcolor="#FAFAFA" alignItems="start">
    <Typography variant="body1" fontSize="18px" fontWeight={600}>
      {title}
    </Typography>
    <Typography flexGrow={1} variant="body1" fontSize="14px" mt={1} mb={3}>
      {content}
    </Typography>
    <ButtonNaked
      endIcon={<ArrowForwardIcon />}
      color="primary"
      size="small"
      sx={{ fontWeight: 700 }}
      onClick={action.callback}
    >
      {action.text}
    </ButtonNaked>
  </Stack>
);

const LegalContactManager: React.FC<Props> = ({ setAction }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const { defaultPECAddress, defaultSERCQ_SENDAddress, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const { IS_DOD_ENABLED } = getConfiguration();
  const hasSercqSendActive = !!defaultSERCQ_SENDAddress;
  const channelType = hasSercqSendActive ? ChannelType.SERCQ_SEND : ChannelType.PEC;

  const isValidatingPec = defaultPECAddress?.pecValid === false;

  const getConfig = (): {
    label: string;
    color: ChipProps['color'];
    value: string;
  } => {
    if (isValidatingPec) {
      return {
        label: t('status.pec-validation', { ns: 'recapiti' }),
        color: 'warning',
        value: hasSercqSendActive
          ? t('legal-contacts.digital-domicile-management.sercq_send-active')
          : '',
      };
    } else if (hasSercqSendActive || !!defaultPECAddress) {
      return {
        label: t('status.active', { ns: 'recapiti' }),
        color: 'success',
        value:
          defaultPECAddress?.value ??
          t('legal-contacts.digital-domicile-management.sercq_send-active'),
      };
    }
    return {
      label: t('status.inactive', { ns: 'recapiti' }),
      color: 'default',
      value: '',
    };
  };

  const config = getConfig();

  const handleAddSpecialContact = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_CUSTOMIZED_CONTACT, {
      event_type: EventAction.ACTION,
      addresses,
    });
    setAction(DigitalDomicileManagementAction.ADD_SPECIAL_CONTACT);
  };

  return (
    <Stack data-testid="legalContactManager" spacing={2}>
      <Paper sx={{ p: { xs: 2, lg: 3 } }}>
        <Chip label={config.label} color={config.color} />
        <Typography variant="body1" fontSize="18px" fontWeight={600} mt={2}>
          {config.value}
        </Typography>
      </Paper>
      {config.color === 'success' && (
        <Paper sx={{ p: { xs: 2, lg: 3 } }}>
          {IS_DOD_ENABLED && (
            <Typography
              variant="h6"
              fontSize={{ xs: '22px', lg: '24px' }}
              fontWeight={700}
              mb={2}
              data-testid="legalContactsTitle"
            >
              {t('legal-contacts.digital-domicile-management.choose-action')}
            </Typography>
          )}
          <Stack display="flex" direction={{ xs: 'column', lg: 'row' }} spacing={2}>
            {IS_DOD_ENABLED && (
              <DigitalDomicileOption
                title={t(
                  `legal-contacts.digital-domicile-management.transfer.title-${channelType.toLowerCase()}`
                )}
                content={t(
                  `legal-contacts.digital-domicile-management.transfer.content-${channelType.toLowerCase()}`
                )}
                action={{
                  text: t(
                    `legal-contacts.digital-domicile-management.transfer.action-${channelType.toLowerCase()}`
                  ),
                  callback: () =>
                    setAction(DigitalDomicileManagementAction.DIGITAL_DOMICILE_TRANSFER),
                }}
              />
            )}
            <DigitalDomicileOption
              title={t('legal-contacts.digital-domicile-management.special_contacts.title')}
              content={t('legal-contacts.digital-domicile-management.special_contacts.content')}
              action={{
                text: t('legal-contacts.digital-domicile-management.special_contacts.action'),
                callback: handleAddSpecialContact,
              }}
            />
          </Stack>
        </Paper>
      )}
    </Stack>
  );
};

export default LegalContactManager;
