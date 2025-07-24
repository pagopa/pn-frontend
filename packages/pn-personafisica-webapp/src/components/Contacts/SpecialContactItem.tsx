import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, DigitalAddress, Sender } from '../../models/contacts';
import DigitalContact from './DigitalContact';
import PecValidationItem from './PecValidationItem';

type Props = {
  address: DigitalAddress;
  showSenderName?: boolean;
  onEdit: (value: string, channelType: ChannelType, sender: Sender) => void;
  onDelete: (value: string, channelType: ChannelType, sender: Sender) => void;
  onCancelValidation: (senderId: string) => void;
};

const SpecialContactItem: React.FC<Props> = ({
  address,
  showSenderName = true,
  onDelete,
  onEdit,
  onCancelValidation,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);

  const hasPecInValidationForEntity = (senderId: string) =>
    address.channelType === ChannelType.PEC && !address.pecValid && address.senderId === senderId;

  const { value, channelType, senderId, senderName, pecValid, addressType } = address;
  const isVerifyingPec = channelType === ChannelType.PEC && !pecValid;
  const isSercq = channelType === ChannelType.SERCQ_SEND;

  const handleDelete = () => {
    onDelete(value, channelType, {
      senderId,
      senderName,
    });
  };

  return (
    <Stack direction="column">
      {showSenderName && (
        <Typography variant="caption" mb={1}>
          {address.senderName}
        </Typography>
      )}
      {isVerifyingPec && (
        <Box key={`${address.senderId}-${address.value}`}>
          <Chip
            label={t('legal-contacts.pec-validating')}
            color="warning"
            size="small"
            sx={{ mb: 2 }}
          />
          <PecValidationItem senderId={senderId} onCancelValidation={onCancelValidation} />
        </Box>
      )}
      {!isVerifyingPec && (
        <Stack
          key={`${address.senderId}-${address.value}`}
          direction="row"
          spacing={1}
          data-testid={`${senderId}_${channelType.toLowerCase()}SpecialContact`}
        >
          {isSercq ? (
            <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1}>
              <Typography
                sx={{
                  wordBreak: 'break-word',
                  fontSize: '18px',
                  fontWeight: 600,
                }}
                component="span"
                variant="body2"
                data-testid={`special_${channelType}-typography`}
              >
                {t('special-contacts.sercq_send')}
              </Typography>
              <ButtonNaked
                data-testid={`cancelContact-special_${channelType}`}
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
                sx={{
                  color: 'error.dark',
                  fontWeight: 700,
                  justifyContent: 'left',
                  pl: { xs: 0, lg: 3 },
                }}
                size="medium"
                disabled={hasPecInValidationForEntity(senderId)}
              >
                {t('button.disable', { ns: 'common' })}
              </ButtonNaked>
            </Stack>
          ) : (
            <DigitalContact
              value={value}
              channelType={channelType}
              senderId={senderId}
              label=""
              inputProps={{
                label: t('legal-contacts.link-pec-placeholder'),
              }}
              insertButtonLabel={t('button.attiva', { ns: 'common' })}
              onSubmit={(pecValue) => onEdit(pecValue, channelType, { senderId, senderName })}
              onDelete={handleDelete}
              slots={{
                editButton: addressType === AddressType.COURTESY ? () => <></> : undefined,
              }}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default SpecialContactItem;
