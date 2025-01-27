import React from 'react';
import { useTranslation } from 'react-i18next';

import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

type Props = {
  senderId: string;
  onCancelValidation: (senderId: string) => void;
};

const PecValidationItem: React.FC<Props> = ({ senderId, onCancelValidation }) => {
  const { t } = useTranslation(['recapiti', 'common']);

  return (
    <Stack direction="row" spacing={1} alignItems="center" data-testid={`${senderId}_pecContact`}>
      <ButtonNaked
        color="error"
        onClick={() => onCancelValidation(senderId)}
        data-testid="cancelValidation"
        size="medium"
        sx={{ color: 'error.dark', fontWeight: 700 }}
        startIcon={<CloseIcon sx={{ width: '18px', height: '18px' }} />}
      >
        {t('legal-contacts.cancel-pec-validation', { ns: 'recapiti' })}
      </ButtonNaked>
    </Stack>
  );
};

export default PecValidationItem;
