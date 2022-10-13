import { ReactNode, useState } from 'react';
import { Box, Typography, Switch, Link, Button } from '@mui/material';

import { PRIVACY_LINK_RELATIVE_PATH } from '../utils';
import { getLocalizedOrDefaultLabel } from '../services/localization.service';

type Props = {
  handleAcceptTos: () => void;
  transComponent?: (path: string, components: Array<ReactNode>, defaultLoaclization: ReactNode) => ReactNode;
};

const TermsOfServiceHandler = ({ handleAcceptTos, transComponent }: Props) => {
  const [accepted, setAccepted] = useState(false);

  const redirectPrivacyLink = () =>
    window.location.assign(`${window.location.origin}${PRIVACY_LINK_RELATIVE_PATH}#privacy`);
  const redirectToSLink = () =>
    window.location.assign(`${window.location.origin}${PRIVACY_LINK_RELATIVE_PATH}#tos`);

  const PrivacyLink = ({ children }: { children?: ReactNode }) => (
    <Link
      key="privacy-link"
      sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
      onClick={redirectPrivacyLink}
    >
      {children}
    </Link>
  );

  const TosLink = ({ children }: { children?: ReactNode }) => (
    <Link
      key="tos-link"
      data-testid="terms-and-conditions"
      sx={{ cursor: 'pointer', textDecoration: 'none !important' }}
      onClick={redirectToSLink}
    >
      {children}
    </Link>
  );

  const UnlocalizedSwitchLabel = () => (
    <>
      Accetto l&apos;<PrivacyLink>Informativa Privacy</PrivacyLink>&nbsp;e&nbsp;i&nbsp;
      <TosLink>Termini e condizioni d&apos;uso</TosLink>&nbsp;di Piattaforma Notifiche.
    </>
  );

  return (
    <Box>
      <Typography mb={2} variant="h2" color="textPrimary" textAlign="center">
        {getLocalizedOrDefaultLabel('common', 'tos.title', 'Piattaforma Notifiche')}
      </Typography>
      <Typography textAlign="center" variant="body1">
        {getLocalizedOrDefaultLabel(
          'common',
          'tos.body',
          'Per accedere, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso.'
        )}
      </Typography>
      <Box display="flex" alignItems="center" mt={8}>
        <Switch value={accepted} onClick={() => setAccepted(!accepted)} data-testid="tosSwitch" />
        <Typography color="text.secondary" variant="body1">
          {transComponent && transComponent("tos.switchLabel", [<PrivacyLink />, <TosLink />], <UnlocalizedSwitchLabel />)}
          {!transComponent && <UnlocalizedSwitchLabel />}
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
          {getLocalizedOrDefaultLabel('common', 'tos.button', 'Accedi')}
        </Button>
      </Box>
    </Box>
  );
};

export default TermsOfServiceHandler;
