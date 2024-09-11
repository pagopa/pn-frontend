import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, DigitalAddress, Sender } from '../../models/contacts';

type Props = {
  addresses: Array<DigitalAddress>;
  onEdit: (
    value: string,
    channelType: ChannelType,
    addressType: AddressType,
    sender: Sender
  ) => void;
  onDelete: (
    value: string,
    channelType: ChannelType,
    addressType: AddressType,
    sender: Sender
  ) => void;
  onCancelValidation: (senderId: string) => void;
};

const SpecialContactItem: React.FC<Props> = ({
  addresses,
  onDelete,
  onEdit,
  onCancelValidation,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const isMobile = useIsMobile();

  const renderAddress = (address: DigitalAddress) => {
    const { value, channelType, addressType, senderId, senderName, pecValid } = address;
    const isVerifyingPec = channelType === ChannelType.PEC && !pecValid;

    return (
      <Fragment key={address.value}>
        {isVerifyingPec ? (
          <Stack
            direction="row"
            spacing={1}
            data-testid={`${senderId}_${channelType.toLowerCase()}Contact`}
          >
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
        ) : (
          <Stack
            direction="row"
            spacing={1}
            data-testid={`${senderId}_${channelType.toLowerCase()}Contact`}
          >
            <VerifiedIcon fontSize="small" color="success" />
            <Box>
              <Typography
                sx={{
                  wordBreak: 'break-word',
                  fontWeight: 600,
                  mb: 2,
                }}
                variant="body2"
                data-testid={`special_${channelType}-typography`}
              >
                {value}
              </Typography>
              <ButtonNaked
                key="editButton"
                color="primary"
                onClick={() =>
                  onEdit(value, channelType, addressType, {
                    senderId,
                    senderName,
                  })
                }
                sx={{ mr: 2 }}
                disabled={false}
                data-testid={`modifyContact-special_${channelType}`}
                size="medium"
              >
                {t('button.modifica', { ns: 'common' })}
              </ButtonNaked>
              <ButtonNaked
                data-testid={`cancelContact-special_${channelType}`}
                color="error"
                onClick={() =>
                  onDelete(value, channelType, addressType, {
                    senderId,
                    senderName,
                  })
                }
                disabled={false}
                size="medium"
              >
                {t('button.elimina', { ns: 'common' })}
              </ButtonNaked>
            </Box>
          </Stack>
        )}
      </Fragment>
    );
  };

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      spacing={isMobile ? 0 : 6}
      sx={{ mb: isMobile ? 2 : 0.5, mt: isMobile ? 2 : '43px' }}
    >
      {isMobile && (
        <Typography variant="caption" fontWeight={600} lineHeight="18px">
          {t('special-contacts.sender', { ns: 'recapiti' })}
        </Typography>
      )}

      <Typography
        variant="caption"
        fontWeight={600}
        mt={isMobile ? 1 : undefined}
        mb={isMobile ? 3 : undefined}
        sx={{ width: isMobile ? 'auto' : '224px' }}
      >
        {addresses[0].senderName}
      </Typography>

      {isMobile && (
        <Typography variant="caption" fontWeight={600} mb={1}>
          {t('special-contacts.contacts', { ns: 'recapiti' })}
        </Typography>
      )}

      <Stack direction={isMobile ? 'column' : 'row'} spacing={3}>
        {addresses.map((address) => renderAddress(address))}
      </Stack>
    </Stack>
  );
};

export default SpecialContactItem;
