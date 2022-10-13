import { Box, Typography, Switch, Link, Button } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { PRIVACY_LINK_RELATIVE_PATH, URL_DIGITAL_NOTIFICATIONS } from '../utils';
import { getLocalizedOrDefaultLabel } from "../services/localization.service";

type Props = {
  handleAcceptTos: () => void;
};

const TermsOfServiceHandler = ({
  handleAcceptTos,
}: Props) => {
  const { t } = useTranslation(['common']);
  const [accepted, setAccepted] = useState(false);

  const redirectPrivacyLink = () => window.location.assign(`${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}#privacy`);
  const redirectToSLink = () => window.location.assign(`${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}#tos`);

  return (
    <Box>
      <Typography mb={2} variant="h2" color="textPrimary" textAlign="center">
        {getLocalizedOrDefaultLabel('common', 'tos.title', 'Piattaforma Notifiche')}
      </Typography>
      <Typography textAlign="center" variant="body1">
        {getLocalizedOrDefaultLabel('common', 'tos.title', 'Per accedere, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso.')}
      </Typography>
      <Box display="flex" alignItems="center" mt={8}>
        <Switch value={accepted} onClick={() => setAccepted(!accepted)} data-testid="tosSwitch" />
        <Typography color="text.secondary" variant="body1">
          {getLocalizedOrDefaultLabel('common', 'tos.switchLabel', 'Per accedere, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso.')}
          <Trans
            i18nKey="tos.switchLabel"
            shouldUnescape
            components={[
              <Link
                key="privacy-link"
                sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                onClick={redirectPrivacyLink}
              />,
              <Link
                key={'tos-link'}
                data-testid="terms-and-conditions"
                sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                onClick={redirectToSLink}
              />,
            ]}
          >
            Accetto l&apos;
            <Link
              sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
              onClick={redirectPrivacyLink}
            >
              Informativa Privacy
            </Link>
            {' e i '}
            <Link
              sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
              onClick={redirectToSLink}
            >
              Termini e condizioni d&apos;uso
            </Link>
            di Piattaforma Notifiche.
          </Trans>
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{ margin: '24px 0' }}
          disabled={!accepted}
          onClick={handleAcceptTos}
          data-testid="accessButton"
        >
          {t('tos.button')}
        </Button>
      </Box>
    </Box>
  );
};

export default TermsOfServiceHandler;
