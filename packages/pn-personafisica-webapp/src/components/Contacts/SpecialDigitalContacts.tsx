import { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { fromStringToBase64, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ChannelType, DigitalAddress, Sender } from '../../models/contacts';
import { Party } from '../../models/party';
import AddSpecialContactDialog from './AddSpecialContactDialog';

export type SpecialAddress = Omit<DigitalAddress, 'senderId' | 'senderName'> & {
  senders: Array<{ senderId: string; senderName?: string }>;
};

type Props = {
  digitalAddresses: Array<DigitalAddress>;
  channelType: ChannelType;
  prefix?: string;
  onConfirm: (value: string, sender: Sender) => void;
  onDelete: (value: string, sender: Sender) => void;
};

enum ModalType {
  SPECIAL = 'special',
}

const SpecialDigitalContacts: React.FC<Props> = ({
  digitalAddresses,
  channelType,
  prefix,
  onConfirm,
  onDelete,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const isMobile = useIsMobile();
  const [modalOpen, setModalOpen] = useState<{
    type: ModalType;
    data: { value: string; senders: Array<Party> };
  } | null>(null);

  const contactType = channelType.toLowerCase();

  // TODO: spostare logica lato bff
  // per questa view abbiamo bisogno di una lista di indirizzi dove ogni indirizzo ha una lista di sender
  const specialAddresses: Array<SpecialAddress> = digitalAddresses.reduce((arr, addr) => {
    const addressIndex = arr.findIndex((a) => a.value === addr.value);
    if (addressIndex === -1) {
      const specialAddress = {
        addressType: addr.addressType,
        channelType: addr.channelType,
        value: addr.value,
        pecValid: addr.pecValid,
        codeValid: addr.codeValid,
        senders: [{ senderId: addr.senderId, senderName: addr.senderName }],
      };
      // eslint-disable-next-line functional/immutable-data
      arr.push(specialAddress);
    } else {
      // eslint-disable-next-line functional/immutable-data
      arr[addressIndex].senders.push({ senderId: addr.senderId, senderName: addr.senderName });
    }
    return arr;
  }, [] as Array<SpecialAddress>);

  return (
    <>
      {specialAddresses?.map((address) => (
        <Fragment key={fromStringToBase64(address.value)}>
          <Divider
            sx={{
              backgroundColor: 'white',
              color: 'text.secondary',
              my: isMobile ? 3 : 2,
            }}
          />
          <Stack
            direction={{ xs: 'column-reverse', sm: 'row' }}
            spacing={2}
            data-testid={`special_${contactType}`}
          >
            <Stack direction="row" spacing={2}>
              <VerifiedIcon
                fontSize="small"
                color="success"
                sx={{ position: 'relative', top: '2px' }}
              />
              <Box>
                <Typography
                  sx={{
                    wordBreak: 'break-word',
                    fontWeight: 600,
                  }}
                  variant="body2"
                  data-testid={`special_${contactType}-typography`}
                >
                  {address.value}
                </Typography>
                <ButtonNaked
                  key="editButton"
                  color="primary"
                  onClick={() =>
                    setModalOpen({
                      type: ModalType.SPECIAL,
                      data: {
                        value: address.value,
                        senders: address.senders.map((sender) => ({
                          id: sender.senderId,
                          name: sender.senderName ?? '',
                        })),
                      },
                    })
                  }
                  sx={{ mr: 2 }}
                  disabled={false}
                  data-testid={`modifyContact-special_${contactType}`}
                  size="medium"
                >
                  {t('button.modifica')}
                </ButtonNaked>
                <ButtonNaked
                  data-testid={`cancelContact-special_${contactType}`}
                  color="error"
                  // ATTENZIONE
                  // al momento le api non accettano più sender alla volta
                  // per testare il giro, si utilizza sempre il primo sender
                  onClick={() => onDelete(address.value, address.senders[0])}
                  disabled={false}
                  size="medium"
                >
                  {t('button.elimina')}
                </ButtonNaked>
              </Box>
            </Stack>
            <Stack paddingLeft={{ xs: 0, sm: 8 }}>
              <Typography variant="caption-semibold">
                {t(`special-contacts.sender-list`, { ns: 'recapiti' })}
              </Typography>
              <Typography variant="caption">
                {address.senders.map((sender) => sender.senderName).join(', ')}
              </Typography>
            </Stack>
          </Stack>
        </Fragment>
      ))}
      <Divider
        sx={{
          backgroundColor: 'white',
          color: 'text.secondary',
          my: 2,
        }}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        mt={{ xs: 1, sm: 0 }}
        alignItems="baseline"
        data-testid={`special_${contactType}Contact`}
      >
        <Typography variant="caption" lineHeight="1.125rem">
          {t(`special-contacts.${contactType}-add-more-caption`, { ns: 'recapiti' })}
        </Typography>
        <ButtonNaked
          component={Typography}
          onClick={() =>
            setModalOpen({ type: ModalType.SPECIAL, data: { value: '', senders: [] } })
          }
          color="primary"
          size="small"
          p={{ xs: '0.5rem 0', sm: 1 }}
          data-testid="addMoreButton"
        >
          {t(`special-contacts.${contactType}-add-more-button`, { ns: 'recapiti' })}
        </ButtonNaked>
      </Stack>
      <AddSpecialContactDialog
        open={modalOpen?.type === ModalType.SPECIAL}
        value={modalOpen?.data.value ?? ''}
        senders={modalOpen?.data.senders ?? []}
        prefix={prefix}
        onDiscard={() => setModalOpen(null)}
        // ATTENZIONE
        // al momento le api non accettano più sender alla volta
        // per testare il giro, si utilizza sempre il primo sender
        onConfirm={(value: string, senders: Array<Party>) => {
          setModalOpen(null);
          onConfirm(value, { senderId: senders[0].id, senderName: senders[0].name });
        }}
        digitalAddresses={specialAddresses}
        channelType={channelType}
      />
    </>
  );
};

export default SpecialDigitalContacts;
