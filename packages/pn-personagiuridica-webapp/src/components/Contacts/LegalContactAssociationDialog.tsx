import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Button } from '@mui/material';
import { ConfirmationModal } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress, Sender } from '../../models/contacts';

type Props = {
  open: boolean;
  sender?: Sender;
  oldAddress?: Omit<DigitalAddress, keyof Sender>;
  newAddress?: Omit<DigitalAddress, keyof Sender>;
  onConfirm: () => void;
  onCancel: () => void;
};

const LegalContactAssociationDialog: React.FC<Props> = ({
  open = false,
  sender,
  oldAddress,
  newAddress,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const addressAlreadySet =
    oldAddress?.channelType === newAddress?.channelType &&
    (oldAddress?.value === newAddress?.value || oldAddress?.channelType === ChannelType.SERCQ_SEND);

  const newAddressValue =
    newAddress?.channelType === ChannelType.PEC
      ? newAddress.value
      : t(`special-contacts.${newAddress?.channelType.toLowerCase()}`, { ns: 'recapiti' });
  const oldAddressValue =
    oldAddress?.channelType === ChannelType.PEC
      ? oldAddress.value
      : t(`special-contacts.${oldAddress?.channelType.toLowerCase()}`, { ns: 'recapiti' });

  const blockConfirmation = addressAlreadySet ? '-block' : '';

  return (
    <ConfirmationModal
      open={open}
      title={t(`special-contacts.legal-association-title${blockConfirmation}`, { ns: 'recapiti' })}
      slots={{
        confirmButton: blockConfirmation ? () => <></> : Button,
        closeButton: Button,
      }}
      slotsProps={{
        closeButton: {
          onClick: onCancel,
          variant: blockConfirmation ? 'contained' : 'outlined',
          children: blockConfirmation ? t('button.close') : t('button.annulla'),
        },
        confirmButton: {
          onClick: onConfirm,
          children: t('button.conferma'),
        },
      }}
    >
      <Trans
        ns="recapiti"
        i18nKey={`special-contacts.legal-association-description${blockConfirmation}`}
        values={{
          senderName: sender?.senderName,
          newAddress: newAddressValue,
          oldAddress: oldAddressValue,
        }}
      />
    </ConfirmationModal>
  );
};

export default LegalContactAssociationDialog;
