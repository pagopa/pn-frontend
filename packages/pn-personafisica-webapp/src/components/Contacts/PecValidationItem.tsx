import React from 'react';
import { useTranslation } from 'react-i18next';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Box, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  senderId: string;
  onCancelValidation: (senderId: string) => void;
};

const PecValidationItem: React.FC<Props> = ({ senderId, onCancelValidation }) => {
  const { t } = useTranslation(['recapiti', 'common']);

  return (
    <Stack direction="row" spacing={1} data-testid={`${senderId}_pecContact`}>
      <AutorenewIcon fontSize="small" sx={{ color: '#5C6F82' }} />
      <Box>
        <Typography
          id="validationPecProgress"
          variant="body2"
          color="textSecondary"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          {t('legal-contacts.pec-validating', { ns: 'recapiti' })}
        </Typography>
        <ButtonNaked
          color="error"
          onClick={() => onCancelValidation(senderId)}
          data-testid="cancelValidation"
          size="medium"
        >
          {t('legal-contacts.cancel-pec-validation', { ns: 'recapiti' })}
        </ButtonNaked>
      </Box>
    </Stack>
  );
};

export default PecValidationItem;
