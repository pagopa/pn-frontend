import { useTranslation } from 'react-i18next';

import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Chip, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ChannelType, DigitalAddress, Sender } from '../../models/contacts';
import DefaultDigitalContact from './DefaultDigitalContact';
import PecValidationItem from './PecValidationItem';

type Props = {
  index: number;
  addresses: Array<DigitalAddress>;
  onEdit: (value: string, channelType: ChannelType, sender: Sender) => void;
  onDelete: (value: string, channelType: ChannelType, sender: Sender) => void;
  onCancelValidation: (senderId: string) => void;
};

const SpecialContactItem: React.FC<Props> = ({
  addresses,
  onDelete,
  onEdit,
  onCancelValidation,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);

  const hasPecInValidationForEntity = (senderId: string) =>
    !!addresses.find(
      (addr) => addr.channelType === ChannelType.PEC && !addr.pecValid && addr.senderId === senderId
    );

  const renderAddress = (address: DigitalAddress) => {
    const { value, channelType, senderId, senderName, pecValid } = address;
    const isVerifyingPec = channelType === ChannelType.PEC && !pecValid;
    const isSercq = channelType === ChannelType.SERCQ_SEND;

    const handleDelete = () => {
      onDelete(value, channelType, {
        senderId,
        senderName,
      });
    };

    if (isVerifyingPec) {
      return (
        <Box key={address.value}>
          <Chip
            label={t('legal-contacts.pec-validating', { ns: 'recapiti' })}
            color="warning"
            size="small"
            sx={{ mb: 2 }}
          />
          <PecValidationItem senderId={senderId} onCancelValidation={onCancelValidation} />
        </Box>
      );
    }

    return (
      <Box key={address.value}>
        <Stack
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
                {t('special-contacts.sercq_send', { ns: 'recapiti' })}
              </Typography>
              <ButtonNaked
                data-testid={`cancelContact-special_${channelType}`}
                color="error"
                onClick={handleDelete}
                startIcon={<DeleteIcon />}
                sx={{ fontWeight: 700, justifyContent: 'left', pl: { xs: 0, lg: 3 } }}
                size="medium"
                disabled={hasPecInValidationForEntity(senderId)}
              >
                {t('button.disable', { ns: 'common' })}
              </ButtonNaked>
            </Stack>
          ) : (
            <DefaultDigitalContact
              value={value}
              channelType={channelType}
              label=""
              inputProps={{
                label: t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' }),
              }}
              insertButtonLabel={t('button.attiva')}
              onSubmit={(pecValue) => onEdit(pecValue, channelType, { senderId, senderName })}
              onDelete={handleDelete}
            />
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Stack direction="column">
      <Typography variant="caption" mb={1}>
        {addresses[0].senderName}
      </Typography>

      {addresses.map((address) => renderAddress(address))}
    </Stack>
  );
};

export default SpecialContactItem;
