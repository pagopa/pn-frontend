import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, DigitalAddress, Sender } from '../../models/contacts';
import PecValidationItem from './PecValidationItem';

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
  handleCreateNewAssociation: (sender: Sender) => void;
  onCancelValidation: (senderId: string) => void;
  showAddButton: (sender: Sender) => boolean;
};

interface AddMoreButtonProps {
  onClick: () => void;
}

const AddMoreButton: React.FC<AddMoreButtonProps> = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <ButtonNaked
      data-testid="addMoreSpecialContacts"
      color="primary"
      size="medium"
      onClick={onClick}
    >
      {t('button.add')}
    </ButtonNaked>
  );
};

const SpecialContactItem: React.FC<Props> = ({
  addresses,
  onDelete,
  onEdit,
  handleCreateNewAssociation,
  onCancelValidation,
  showAddButton,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);

  const senderHasAllAddresses = addresses.length === 4;
  const shouldShowAddButton =
    !senderHasAllAddresses &&
    showAddButton({
      senderId: addresses[0].senderId,
      senderName: addresses[0].senderName,
    });

  const handleClickAddButton = () => {
    handleCreateNewAssociation({
      senderId: addresses[0].senderId,
      senderName: addresses[0].senderName,
    });
  };

  const renderAddress = (address: DigitalAddress) => {
    const { value, channelType, addressType, senderId, senderName, pecValid } = address;
    const isVerifyingPec = channelType === ChannelType.PEC && !pecValid;

    return (
      <Fragment key={address.value}>
        {isVerifyingPec ? (
          <PecValidationItem senderId={senderId} onCancelValidation={onCancelValidation} />
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
      direction={{ xs: 'column', lg: 'row' }}
      spacing={{ xs: 3, lg: 6 }}
      mb={{ xs: 2, lg: 0.5 }}
      mt={{ xs: 2, lg: '43px' }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Stack spacing={1} width={{ xs: 'auto', lg: '224px' }}>
          <Typography
            variant="caption"
            fontWeight={600}
            lineHeight="18px"
            sx={{ display: { xs: 'block', lg: 'none' } }}
          >
            {t('special-contacts.sender', { ns: 'recapiti' })}
          </Typography>

          <Typography variant="caption" fontWeight={600}>
            {addresses[0].senderName}
          </Typography>
        </Stack>
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          {shouldShowAddButton && <AddMoreButton onClick={handleClickAddButton} />}
        </Box>
      </Stack>

      <Stack spacing={1} width="100%">
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ display: { xs: 'block', lg: 'none' }, mb: 1 }}
        >
          {t('special-contacts.contacts', { ns: 'recapiti' })}
        </Typography>

        <Stack direction="row" justifyContent="space-between">
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
            {addresses.map((address) => renderAddress(address))}
          </Stack>
          <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
            {shouldShowAddButton && <AddMoreButton onClick={handleClickAddButton} />}
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SpecialContactItem;
