import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Stack, Typography } from '@mui/material';
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

    const isSercq = channelType === ChannelType.SERCQ;

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
                {isSercq ? t('special-contacts.sercq', { ns: 'recapiti' }) : value}
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
                  disabled={false}
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
                disabled={false}
                size="medium"
              >
                {t(`button.${isSercq ? 'disable' : 'elimina'}`, { ns: 'common' })}
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
      </Stack>

      <Stack spacing={1} width="100%">
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ display: { xs: 'block', lg: 'none' }, mb: 1 }}
        >
          {t('special-contacts.contacts', { ns: 'recapiti' })}
        </Typography>

        <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between">
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
            {addresses.map((address) => renderAddress(address))}
          </Stack>
          <Box>{shouldShowAddButton && <AddMoreButton onClick={handleClickAddButton} />}</Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SpecialContactItem;
