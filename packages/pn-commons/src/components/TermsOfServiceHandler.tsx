import { Box, Typography, Switch, Link, Button } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

type Props = {
  handleAcceptTos: () => void;
  handleRedirectPrivacyLink: () => void;
  handleRedirectTosLink: () => void;
};

const TermsOfServiceHandler = ({
  handleAcceptTos,
  handleRedirectPrivacyLink,
  handleRedirectTosLink,
}: Props) => {
  const { t } = useTranslation(['common']);
  const [accepted, setAccepted] = useState(false);

  return (
    <Box>
      <Typography textAlign="center" variant="body1">
        <Trans i18nKey={'tos.body'}>
          Per accedere, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso.
        </Trans>
      </Typography>
      <Box display="flex" alignItems="center" mt={8}>
        <Switch value={accepted} onClick={() => setAccepted(!accepted)} data-testid="tosSwitch" />
        <Typography color="text.secondary" variant="body1">
          <Trans
            i18nKey="tos.switchLabel"
            shouldUnescape
            components={[
              <Link
                key="privacy-link"
                sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                onClick={handleRedirectPrivacyLink}
              />,
              <Link
                key={'tos-link'}
                data-testid="terms-and-conditions"
                sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
                onClick={handleRedirectTosLink}
              />,
            ]}
          >
            Accetto l&apos;
            <Link
              sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
              onClick={handleRedirectPrivacyLink}
            >
              Informativa Privacy
            </Link>
            {' e i '}
            <Link
              sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
              onClick={handleRedirectTosLink}
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
