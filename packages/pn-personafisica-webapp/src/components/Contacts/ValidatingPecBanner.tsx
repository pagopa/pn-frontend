import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Typography } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';

const ValidatingPecBanner: React.FC = () => {
  const { t } = useTranslation(['recapiti']);
  const {
    defaultPECAddress,
    defaultSERCQ_SENDAddress,
    specialPECAddresses,
    specialSERCQ_SENDAddresses,
  } = useAppSelector(contactsSelectors.selectAddresses);

  const isValidatingDefaultPec = defaultPECAddress?.pecValid === false;

  const isDefaultSercqSendActive = !!defaultSERCQ_SENDAddress;

  const validatingSpecialPecList: Array<string> = specialPECAddresses
    .filter(
      (pecAddr) =>
        pecAddr.pecValid === false &&
        (isDefaultSercqSendActive ||
          specialSERCQ_SENDAddresses.some((sercqAddr) => sercqAddr.senderId === pecAddr.senderId))
    )
    .map((addr) => addr.senderName ?? addr.senderId);

  // eslint-disable-next-line functional/no-let
  let bannerMessage = '';
  if (!isValidatingDefaultPec && validatingSpecialPecList.length === 0) {
    return;
  }
  if (isValidatingDefaultPec) {
    if (isDefaultSercqSendActive) {
      bannerMessage = 'dod-enabled-message';
    } else {
      bannerMessage = 'dod-disabled-message';
    }
  } else {
    bannerMessage = 'parties-list';
  }
  return (
    <Alert data-testid="PecVerificationAlert" severity="warning" sx={{ my: { xs: 2, lg: 4 } }}>
      <Typography variant="inherit" sx={{ fontWeight: '600' }}>
        {t('legal-contacts.pec-validation-banner.title')}
      </Typography>
      <Typography variant="inherit">
        {t(`legal-contacts.pec-validation-banner.${bannerMessage}`, {
          list: validatingSpecialPecList.join(', '),
        })}
      </Typography>
    </Alert>
  );
};

export default ValidatingPecBanner;
