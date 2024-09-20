import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, DigitalAddress, Sender } from '../../models/contacts';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import { specialContactsAvailableAddressTypes } from '../../utility/contacts.utility';
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
}) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const addressData = useAppSelector(contactsSelectors.selectAddresses);
  const isMobile = useIsMobile();

  const showAddButton = (sender: Sender) => {
    const filteredAddresses = specialContactsAvailableAddressTypes(addressData, sender);
    return filteredAddresses.some((a) => a.shown && !a.disabled);
  };

  const shouldShowAddButton = showAddButton({
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

    const isSercq = channelType === ChannelType.SERCQ_SEND;

    return (
      <Box key={address.value} sx={{ flexBasis: { xs: 'auto', lg: '224px' } }}>
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
                {isSercq ? t('special-contacts.sercq_send', { ns: 'recapiti' }) : value}
              </Typography>
              {!isSercq && (
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
                  data-testid={`modifyContact-special_${channelType}`}
                  size="medium"
                >
                  {t('button.modifica', { ns: 'common' })}
                </ButtonNaked>
              )}
              <ButtonNaked
                data-testid={`cancelContact-special_${channelType}`}
                color="error"
                onClick={() =>
                  onDelete(value, channelType, addressType, {
                    senderId,
                    senderName,
                  })
                }
                size="medium"
              >
                {t(`button.${isSercq ? 'disable' : 'elimina'}`, { ns: 'common' })}
              </ButtonNaked>
            </Box>
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={{ xs: 3, lg: 6 }}
      mb={{ xs: 2, lg: 0.5 }}
      mt={{ xs: 2, lg: '43px' }}
    >
      <Box sx={{ flexBasis: { xs: 'auto', lg: '224px' } }}>
        {isMobile && (
          <Typography variant="caption" fontWeight={600} lineHeight="18px" display="block" mb={1}>
            {t('special-contacts.sender', { ns: 'recapiti' })}
          </Typography>
        )}
        <Typography variant="caption" fontWeight={600}>
          {addresses[0].senderName}
        </Typography>
      </Box>
      {isMobile && (
        <Typography variant="caption" fontWeight={600} mb={1}>
          {t('special-contacts.contacts', { ns: 'recapiti' })}
        </Typography>
      )}
      {addresses.map((address) => renderAddress(address))}
      {shouldShowAddButton && (
        <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
          <AddMoreButton onClick={handleClickAddButton} />
        </Box>
      )}
    </Stack>
  );
};

export default SpecialContactItem;
