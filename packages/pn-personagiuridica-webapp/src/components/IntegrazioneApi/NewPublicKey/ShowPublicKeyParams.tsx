import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CopyToClipboardButton } from '@pagopa/mui-italia';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { InputAdornment, InputLabel, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';

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
      submitLabel={t('button.end', { ns: 'common' })}
      onSubmit={handleSubmit}
      content={
        <Typography data-testid="content" variant="body1" mt={2}>
          {t('new-public-key.steps.get-returned-parameters.description')}
        </Typography>
      }
    >
      <Box>
        <InputAdornment position="start" sx={{ mb: 2 }}>
          <VpnKeyIcon />
          <InputLabel sx={{ ml: 1 }} htmlFor="kid">
            {t('new-public-key.steps.get-returned-parameters.kid')}
          </InputLabel>
        </InputAdornment>
        <TextField
          id="kid"
          value={params?.kid}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <CopyToClipboardButton
                  color="primary"
                  value={() => params?.kid || ''}
                  tooltipTitle={t('new-public-key.kid-copied')}
                />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box>
        <InputAdornment position="start" sx={{ my: 2 }}>
          <AssignmentIndIcon />
          <InputLabel sx={{ ml: 1 }} htmlFor="issuer">
            {t('new-public-key.steps.get-returned-parameters.issuer')}
          </InputLabel>
        </InputAdornment>
        <TextField
          value={params?.issuer}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <CopyToClipboardButton
                  color="primary"
                  value={() => params?.issuer || ''}
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
