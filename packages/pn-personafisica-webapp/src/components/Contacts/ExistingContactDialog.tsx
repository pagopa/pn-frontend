import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { ConfirmationModal } from '@pagopa-pn/pn-commons';
import { MIButton } from '@pagopa/mui-italia';

type Props = {
  open: boolean;
  value: string;
  isDefault?: boolean;
  handleDiscard: () => void;
  handleConfirm: () => void;
};

const ExistingContactDialog: React.FC<Props> = ({
  open = false,
  value,
  isDefault = false,
  handleDiscard,
  handleConfirm,
}) => {
  const { t } = useTranslation();
  return (
    <ConfirmationModal
      open={open}
      title={t(`common.duplicate-${isDefault ? 'default-' : ''}contact-title`, {
        value,
        ns: 'recapiti',
      })}
      slots={{
        confirmButton: isDefault ? () => <></> : MIButton,
        closeButton: MIButton,
      }}
      slotsProps={{
        closeButton: {
          onClick: handleDiscard,
          variant: isDefault ? 'contained' : 'outlined',
          children: isDefault ? t('button.understand') : t('button.annulla'),
        },
        confirmButton: {
          onClick: handleConfirm,
          children: t('button.conferma'),
        },
      }}
    >
      <Trans
        ns="recapiti"
        i18nKey={`common.duplicate-${isDefault ? 'default-' : ''}contact-descr`}
        values={{
          value,
        }}
      />
    </ConfirmationModal>
  );
};

export default ExistingContactDialog;
