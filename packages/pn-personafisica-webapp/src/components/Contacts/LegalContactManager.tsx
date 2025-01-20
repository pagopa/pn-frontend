import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Chip, Paper, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ChannelType } from '../../models/contacts';
import { DIGITAL_DOMICILE_TRANSFER } from '../../navigation/routes.const';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';

type Props = {
  goToNextStep: () => void;
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

const LegalContactManager: React.FC<Props> = ({ goToNextStep }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const navigate = useNavigate();
  const { defaultPECAddress, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const { IS_DOD_ENABLED } = getConfiguration();
  const hasSercqSendActive = !!defaultSERCQ_SENDAddress;
  const channelType = hasSercqSendActive ? ChannelType.SERCQ_SEND : ChannelType.PEC;

  return (
    <Stack data-testid="legalContactManager" spacing={2}>
      <Paper sx={{ p: { xs: 2, lg: 3 } }}>
        <Chip label={t('status.active', { ns: 'recapiti' })} color="success" />
        <Typography variant="body1" fontSize="18px" fontWeight={600} mt={2}>
          {defaultPECAddress?.value ??
            t('legal-contacts.digital-domicile-management.sercq_send-active')}
        </Typography>
      </Paper>
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
                callback: () => {
                  navigate(`${DIGITAL_DOMICILE_TRANSFER}`);
                },
              }}
            />
          )}
          <DigitalDomicileOption
            title={t('legal-contacts.digital-domicile-management.special_contacts.title')}
            content={t('legal-contacts.digital-domicile-management.special_contacts.content')}
            action={{
              text: t('legal-contacts.digital-domicile-management.special_contacts.action'),
              callback: goToNextStep,
            }}
          />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default LegalContactManager;
