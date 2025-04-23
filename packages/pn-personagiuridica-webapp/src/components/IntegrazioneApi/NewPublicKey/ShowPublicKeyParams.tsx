import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import { BffPublicKeyResponse } from '../../../generated-client/pg-apikeys';
import * as routes from '../../../navigation/routes.const';
import NewPublicKeyCard from './NewPublicKeyCard';

type Props = {
  params: BffPublicKeyResponse | undefined;
};

const ShowPublicKeyParams: React.FC<Props> = ({ params }) => {
  const { t } = useTranslation(['integrazioneApi', 'common']);
  const navigate = useNavigate();

  const handleSubmit = () => navigate(routes.INTEGRAZIONE_API);

  return (
    <NewPublicKeyCard
      isContinueDisabled={false}
      title={t('new-public-key.steps.get-returned-parameters.title')}
      onContinueClick={handleSubmit}
      content={
        <Typography data-testid="content" variant="body1" mt={2} mb={3} sx={{ fontSize: '14px' }}>
          {t('new-public-key.steps.get-returned-parameters.description')}
        </Typography>
      }
    >
      <Box border="1px solid" borderColor="divider" borderRadius={0.5} p={3} mb={3}>
        <InputAdornment position="start" sx={{ mt: 2, mb: 3 }}>
          <VpnKeyIcon sx={{ color: 'text.primary', width: '24px', height: '24px' }} />
          <InputLabel sx={{ ml: 1, color: 'text.primary', fontSize: '16px' }} htmlFor="kid">
            {t('new-public-key.steps.get-returned-parameters.kid')}
          </InputLabel>
        </InputAdornment>
        <TextField
          id="kid"
          name="kid"
          value={params?.kid}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <CopyToClipboardButton
                  color="primary"
                  value={() => params?.kid ?? ''}
                  tooltipTitle={t('new-public-key.kid-copied')}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box border="1px solid" borderColor="divider" borderRadius={0.5} p={3}>
        <InputAdornment position="start" sx={{ mt: 2, mb: 3 }}>
          <AssignmentIndIcon sx={{ color: 'text.primary', width: '24px', height: '24px' }} />
          <InputLabel sx={{ ml: 1, color: 'text.primary', fontSize: '16px' }} htmlFor="issuer">
            {t('new-public-key.steps.get-returned-parameters.issuer')}
          </InputLabel>
        </InputAdornment>
        <TextField
          id="issuer"
          name="issuer"
          value={params?.issuer}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <CopyToClipboardButton
                  color="primary"
                  value={() => params?.issuer ?? ''}
                  tooltipTitle={t('new-public-key.issuer-copied')}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </NewPublicKeyCard>
  );
};

export default ShowPublicKeyParams;
