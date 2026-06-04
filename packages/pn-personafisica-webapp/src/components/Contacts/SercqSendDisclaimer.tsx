import { Trans } from 'react-i18next';

import { Link, Typography } from '@mui/material';

import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../navigation/routes.const';

type Props = {
  i18nKey: string;
};

const SercqSendDisclaimer: React.FC<Props> = ({ i18nKey }) => (
  <Typography
    my={3}
    variant="body2"
    fontSize="14px"
    color="text.secondary"
    data-testid="sercq-send-disclaimer"
  >
    <Trans
      i18nKey={i18nKey}
      ns="recapiti"
      components={[
        <Link
          key="privacy-policy"
          sx={{
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          data-testid="privacy-link"
          href={PRIVACY_POLICY}
          target="_blank"
          rel="noopener"
        />,

        <Link
          key="tos"
          sx={{
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
          data-testid="tos-link"
          href={TERMS_OF_SERVICE_SERCQ_SEND}
          target="_blank"
          rel="noopener"
        />,
      ]}
    />
  </Typography>
);

export default SercqSendDisclaimer;
