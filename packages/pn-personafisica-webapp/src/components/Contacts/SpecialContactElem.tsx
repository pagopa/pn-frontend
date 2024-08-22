import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { DigitalAddress } from '../../models/contacts';

interface Props {
  address: DigitalAddress;
}

const SpecialContactElem: React.FC<Props> = ({ address }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  return (
    <>
      <Divider
        sx={{
          backgroundColor: 'white',
          color: 'text.secondary',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      />
      <Stack direction="row" spacing={2}>
        <VerifiedIcon fontSize="small" color="success" sx={{ position: 'relative', top: '2px' }} />
        <Box>
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
            id={`${address.senderId}-typography`}
          >
            {address.value}
          </Typography>
          <ButtonNaked
            key="editButton"
            color="primary"
            onClick={() => {}}
            sx={{ mr: 2 }}
            disabled={false}
            id={`modifyContact-${address.senderId}`}
          >
            {t('button.modifica')}
          </ButtonNaked>
          <ButtonNaked
            id={`cancelContact-${address.senderId}`}
            color="error"
            onClick={() => {}}
            disabled={false}
          >
            {t('button.elimina')}
          </ButtonNaked>
        </Box>
      </Stack>
    </>
  );
};

export default SpecialContactElem;
