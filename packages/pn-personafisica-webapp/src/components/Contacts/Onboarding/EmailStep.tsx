import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';
import { appStateActions } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../../models/contacts';
import { createOrUpdateAddress } from '../../../redux/contact/actions';
import { contactsSelectors } from '../../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { contactAlreadyExists, normalizeContactValue } from '../../../utility/contacts.utility';
import ContactCodeDialog from '../ContactCodeDialog';
import DigitalContact from '../DigitalContact';
import ExistingContactDialog from '../ExistingContactDialog';

type Props = {
  value?: string;
  alreadySet: boolean;
  onChange: (value?: string) => void;
};

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
}

const EmailStep: React.FC<Props> = ({ value, alreadySet, onChange }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();
  const { addresses } = useAppSelector(contactsSelectors.selectAddresses);

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);

  const emailContactRef = useRef<{ toggleEdit: () => void; resetForm: () => Promise<void> }>({
    toggleEdit: () => {},
    resetForm: () => Promise.resolve(),
  });

  const currentValueRef = useRef<string>('');

  const handleSubmit = (newValue: string) => {
    const normalizedValue = normalizeContactValue(newValue);

    if (!normalizedValue) {
      return;
    }

    // eslint-disable-next-line functional/immutable-data
    currentValueRef.current = normalizedValue;
    if (normalizedValue === value) {
      emailContactRef.current.toggleEdit();
      return;
    }

    if (contactAlreadyExists(addresses, normalizedValue, 'default', ChannelType.EMAIL)) {
      setModalOpen(ModalType.EXISTING);
      return;
    }

    void handleCodeVerification();
  };

  const handleCodeVerification = async (verificationCode?: string) => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType: ChannelType.EMAIL,
      value: currentValueRef.current,
      code: verificationCode,
    };

    try {
      const res = await dispatch(createOrUpdateAddress(digitalAddressParams)).unwrap();

      if (!res) {
        setModalOpen(ModalType.CODE);
        return;
      }

      dispatch(
        appStateActions.addSuccess({
          title: '',
          message: t('courtesy-contacts.email-added-successfully', { ns: 'recapiti' }),
        })
      );

      setModalOpen(null);
      onChange(currentValueRef.current);

      if (value && alreadySet) {
        emailContactRef.current.toggleEdit();
      }
    } catch {
      // handled by ContactCodeDialog/AppResponsePublisher
    }
  };

  const handleDiscard = async () => {
    setModalOpen(null);

    if (value && alreadySet) {
      emailContactRef.current.toggleEdit();
      await emailContactRef.current.resetForm();
    }
  };

  return (
    <Stack data-testid="email-step">
      <Typography fontSize="22px" fontWeight={700} mb={1}>
        {t('onboarding.digital-domicile.email.title')}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={3}>
        {t('onboarding.digital-domicile.email.description')}
      </Typography>

      <DigitalContact
        ref={emailContactRef}
        label={t('onboarding.digital-domicile.email.label')}
        value={value ?? ''}
        channelType={ChannelType.EMAIL}
        inputProps={{
          label: t('onboarding.digital-domicile.email.input-label'),
        }}
        insertButtonLabel={t('onboarding.digital-domicile.email.verify-cta')}
        onSubmit={handleSubmit}
        showVerifiedIcon
        showLabelOnEdit
        slots={{
          editButton: alreadySet ? undefined : () => <></>,
        }}
        slotsProps={{
          textField: {
            sx: { flexBasis: { xs: 'unset', lg: '50%' } },
          },
          button: {
            sx: {
              height: '43px',
              fontWeight: 700,
              flexBasis: { xs: 'unset', lg: '25%' },
            },
          },
          container: {
            width: '100%',
          },
        }}
      />

      <ContactCodeDialog
        value={currentValueRef.current}
        addressType={AddressType.COURTESY}
        channelType={ChannelType.EMAIL}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => void handleCodeVerification(code)}
        onDiscard={() => void handleDiscard()}
      />

      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={currentValueRef.current}
        handleDiscard={() => void handleDiscard()}
        handleConfirm={() => void handleCodeVerification()}
      />
    </Stack>
  );
};

export default EmailStep;
