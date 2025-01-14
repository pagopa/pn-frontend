import { useTranslation } from 'react-i18next';

import ConstructionIcon from '@mui/icons-material/Construction';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SavingsIcon from '@mui/icons-material/Savings';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Box, Button, Chip, ChipOwnProps, Stack, Typography } from '@mui/material';
import { PnInfoCard, useIsMobile } from '@pagopa-pn/pn-commons';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import PecContactItem from './PecContactItem';
import SpecialContacts from './SpecialContacts';

const EmptyLegalContacts = () => {
  const { t } = useTranslation(['recapiti']);
  const isMobile = useIsMobile();

  const infoIcons = [LaptopChromebookIcon, SavingsIcon, TouchAppIcon];
  const sercqSendInfoList: Array<{ title: string; description: string }> = t(
    'legal-contacts.sercq-send-info-list',
    {
      returnObjects: true,
      defaultValue: [],
      ns: 'recapiti',
    }
  );

  return (
    <Box>
      <Typography variant="body2" fontSize="14px" mb={3}>
        {t('legal-contacts.sercq-send-info-advantages', { ns: 'recapiti' })}
      </Typography>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {infoIcons.map((Icon, index) => {
          const title = sercqSendInfoList[index]?.title;
          const description = sercqSendInfoList[index]?.description;
          return (
            <Stack key={title} direction={{ xs: 'row', lg: 'column' }} spacing={2}>
              <Icon sx={{ height: '24px', width: '24px', color: '#35C1EC' }} />
              <Box>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  {title}
                </Typography>
                <Typography fontSize="14px">{description}</Typography>
              </Box>
            </Stack>
          );
        })}
      </Stack>
      <Button variant="contained" fullWidth={isMobile}>
        {t('legal-contacts.sercq-send-start')}
      </Button>
    </Box>
  );
};

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const { defaultPECAddress, defaultSERCQ_SENDAddress, specialAddresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const isValidatingPec = defaultPECAddress?.value && defaultPECAddress.pecValid === false;
  const hasNoLegalAddress = !defaultPECAddress?.value && !defaultSERCQ_SENDAddress;
  const hasPecActive = defaultPECAddress?.value && defaultPECAddress.pecValid === true;
  const hasSercqSendActive = !!defaultSERCQ_SENDAddress;
  const isActive = (hasPecActive || hasSercqSendActive) && !isValidatingPec;
  const showSpecialContactsSection = specialAddresses.length > 0;

  type SubtitleParams = {
    label: string;
    color: ChipOwnProps['color'];
  };

  const getSubtitle = () => {
    // eslint-disable-next-line functional/no-let
    let params: SubtitleParams;
    if (isValidatingPec) {
      params = {
        label: t('status.pec-validation', { ns: 'recapiti' }),
        color: 'warning',
      };
    } else if (hasNoLegalAddress) {
      params = {
        label: t('status.inactive', { ns: 'recapiti' }),
        color: 'default',
      };
    } else {
      params = {
        label: t('status.active', { ns: 'recapiti' }),
        color: 'success',
      };
    }
    return <Chip {...params} sx={{ mb: 2 }} />;
  };

  const getActions = () =>
    isActive
      ? [
          <Button
            key="manage"
            variant="naked"
            color="primary"
            startIcon={<ConstructionIcon />}
            onClick={() => console.log('Gestisci!')}
            sx={{ p: '10px 16px' }}
          >
            {t('manage', { ns: 'recapiti' })}
          </Button>,
          <Button
            key="disable"
            variant="naked"
            color="error"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => console.log('Disattiva!')}
            sx={{ p: '10px 16px' }}
          >
            {t('disable', { ns: 'recapiti' })}
          </Button>,
        ]
      : undefined;

  const getContactDescriptionMessage = () => {
    if (hasSercqSendActive && !isValidatingPec) {
      return t('legal-contacts.sercq-send-description', { ns: 'recapiti' });
    } else if (hasPecActive || isValidatingPec) {
      return t('legal-contacts.pec-description', { ns: 'recapiti' });
    }
    return '';
  };

  return (
    <PnInfoCard
      title={
        <Typography
          variant="h6"
          fontSize={{ xs: '22px', lg: '24px' }}
          fontWeight={700}
          mb={2}
          data-testid="legalContactsTitle"
        >
          {t('legal-contacts.title', { ns: 'recapiti' })}
        </Typography>
      }
      subtitle={getSubtitle()}
      actions={getActions()}
      expanded={isActive}
      data-testid="legalContacts"
    >
      {(isValidatingPec || hasPecActive) && <PecContactItem />}
      {hasSercqSendActive && !isValidatingPec && (
        <Typography variant="body1" sx={{ fontWeight: '600', mb: 2 }}>
          {t('legal-contacts.sercq-send-title', { ns: 'recapiti' })}
        </Typography>
      )}
      {!hasNoLegalAddress && (
        <Typography variant="body1" fontSize={{ xs: '14px', lg: '18px' }} mt={2}>
          {getContactDescriptionMessage()}
        </Typography>
      )}
      {hasNoLegalAddress && <EmptyLegalContacts />}
      {showSpecialContactsSection && <SpecialContacts />}
    </PnInfoCard>
  );
};

export default LegalContacts;
