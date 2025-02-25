import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { ConfirmationModal } from '@pagopa-pn/pn-commons';

import { ChannelType, DigitalAddress, Sender } from '../../models/contacts';

export type LegalContactAssociationData = {
  sender: Sender;
  oldAddress: DigitalAddress;
  newAddress: DigitalAddress;
};

type Props = {
  open: boolean;
  data?: LegalContactAssociationData;
  onConfirm: () => void;
  onCancel: () => void;
};

const LegalContactAssociationDialog: React.FC<Props> = ({
  open = false,
  data,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const addressAlreadySet =
    data?.oldAddress.channelType === data?.newAddress.channelType &&
    data?.oldAddress.value === data?.newAddress.value;

  const newAddress =
    data?.newAddress.channelType === ChannelType.PEC
      ? data.newAddress.value
      : t(`special-contacts.${data?.newAddress.channelType.toLowerCase()}`, { ns: 'recapiti' });
  const oldAddress =
    data?.oldAddress.channelType === ChannelType.PEC
      ? data.oldAddress.value
      : t(`special-contacts.${data?.oldAddress.channelType.toLowerCase()}`, { ns: 'recapiti' });

  const blockConfirmation = addressAlreadySet || newAddress === oldAddress ? '-block' : '';

  // eslint-disable-next-line functional/no-let
  let slotsProps = {};
  if (blockConfirmation) {
    slotsProps = { closeButton: { onClick: onCancel, variant: 'contained' } };
  } else {
    slotsProps = {
      closeButton: { onClick: onCancel, variant: 'outlined' },
      confirmButton: { onClick: onConfirm, variant: 'contained' },
    };
  }

  return (
    <ConfirmationModal
      open={open}
      title={t(`special-contacts.legal-association-title${blockConfirmation}`, { ns: 'recapiti' })}
      // slotsProps={slotsProps ?? undefined}
      onConfirmLabel={blockConfirmation ? undefined : t('button.conferma')}
      onCloseLabel={blockConfirmation ? t('button.close') : t('button.annulla')}
      slotsProps={slotsProps}
    >
      <Trans
        ns="recapiti"
        i18nKey={`special-contacts.legal-association-description${blockConfirmation}`}
        values={{
          senderName: data?.sender.senderName,
          newAddress,
          oldAddress,
        }}
      />
    </ConfirmationModal>
  );
};

export default LegalContactAssociationDialog;
