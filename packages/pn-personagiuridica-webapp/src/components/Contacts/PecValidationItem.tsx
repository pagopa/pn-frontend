import React from 'react';
import { useTranslation } from 'react-i18next';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Stack } from '@mui/material';
import { MIButton } from '@pagopa/mui-italia';

type Props = {
  senderId: string;
  onCancelValidation: (senderId: string) => void;
};

const PecValidationItem: React.FC<Props> = ({ senderId, onCancelValidation }) => {
  const { t } = useTranslation(['recapiti', 'common']);

  return (
    <Stack direction="row" spacing={1} alignItems="center" data-testid={`${senderId}_pecContact`}>
      <MIButton
        variant="text"
        color="error"
        onClick={() => onCancelValidation(senderId)}
        data-testid="cancelValidation"
        size="medium"
        sx={{ color: 'error.dark' }}
        startIcon={<CloseRoundedIcon sx={{ width: '18px', height: '18px' }} />}
      >
        {t('legal-contacts.cancel-pec-validation', { ns: 'recapiti' })}
      </MIButton>
    </Stack>
  );
};

export default PecValidationItem;
