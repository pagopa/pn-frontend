import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import { EmailOutlined, PhoneOutlined } from '@mui/icons-material';
import { Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { ContactState } from '../../../../models/Onboarding';
import { ChannelType } from '../../../../models/contacts';
import { internationalPhonePrefix } from '../../../../utility/contacts.utility';
import DigitalContact from '../../DigitalContact';
import OnboardingContactItem from '../OnboardingContactItem';

export type CourtesyInputMode = 'collapsed' | 'insert' | 'readonly' | 'edit';

type Props = {
  channelType: ChannelType.EMAIL | ChannelType.SMS;
  mode: CourtesyInputMode;
  contactValue: string;
  contactState: ContactState<string | undefined>;
  contactError?: string;
  contactTouched?: boolean;
  onContactValueChange: (value: string) => void;
  onInputBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onVerifyContact: () => void | Promise<void>;
  onSubmitEdit: (value: string) => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  contactRef: RefObject<{
    toggleEdit: () => void;
    resetForm: () => Promise<void>;
  }>;
};

const CourtesyContactHandler: React.FC<Props> = ({
  channelType,
  mode,
  contactValue,
  contactState,
  contactError,
  contactTouched,
  onContactValueChange,
  onInputBlur,
  onVerifyContact,
  onSubmitEdit,
  onExpand,
  onCollapse,
  contactRef,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);

  const ns = `onboarding.courtesy.${channelType.toLowerCase()}`;

  const labels = {
    readonly: {
      title: t(`${ns}.readonly.title`),
      description: t(`${ns}.readonly.description`),
    },
    insert: {
      title: t(`${ns}.insert.title`),
      description: t(`${ns}.insert.description`),
      inputLabel: t(`${ns}.insert.input-label`),
      buttonLabel: t(`${ns}.insert.button-label`),
      collapseLabel: t(`${ns}.insert.collapse-label`),
    },
    collapsed: {
      label: t(`${ns}.collapsed.label`),
      buttonLabel: t(`${ns}.collapsed.button-label`),
    },
    edit: {
      alreadyPresentTitle: t(`${ns}.edit.title`),
      alreadyPresentDescription: t(`${ns}.edit.description`),
      inputLabel: t(`${ns}.edit.input-label`),
    },
  };

  if (mode === 'collapsed') {
    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {labels.collapsed.label}
        </Typography>

        <ButtonNaked
          color="primary"
          size="medium"
          onClick={onExpand}
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        >
          {labels.collapsed.buttonLabel}
        </ButtonNaked>
      </Stack>
    );
  }

  if (mode === 'insert') {
    return (
      <OnboardingContactItem
        mode="entry"
        title={labels.insert.title}
        label={labels.insert.description}
        inputLabel={labels.insert.inputLabel}
        value={contactValue}
        buttonLabel={labels.insert.buttonLabel}
        buttonVariant="outlined"
        error={contactError}
        touched={contactTouched}
        onChange={onContactValueChange}
        onBlur={onInputBlur}
        onSubmit={onVerifyContact}
        collapse={
          onCollapse ? { onClick: onCollapse, label: labels.insert.collapseLabel } : undefined
        }
        prefix={
          channelType === ChannelType.SMS ? (
            <PhoneOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
          ) : (
            <EmailOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
          )
        }
      />
    );
  }

  if (mode === 'readonly' && contactState.value && !contactState.alreadySet) {
    return (
      <OnboardingContactItem
        mode="view"
        introText={labels.readonly.title}
        description={labels.readonly.description}
        value={contactState.value}
        icon={<EmailOutlined color="disabled" fontSize="small" aria-hidden="true" />}
      />
    );
  }

  if (mode === 'edit') {
    return (
      <Stack>
        <Typography fontSize="18px" fontWeight={700} sx={{ mb: 1 }}>
          {labels.edit.alreadyPresentTitle}
        </Typography>

        <Typography variant="body2" fontSize="16px" color="text.secondary" sx={{ mb: 2 }}>
          {labels.edit.alreadyPresentDescription}
        </Typography>

        <DigitalContact
          channelType={channelType}
          ref={contactRef}
          label=""
          value={contactState.value ?? ''}
          inputProps={{
            label: labels.edit.inputLabel,
            prefix: channelType === ChannelType.SMS ? internationalPhonePrefix : undefined,
          }}
          insertButtonLabel={labels.edit.inputLabel}
          onSubmit={onSubmitEdit}
          showLabelOnEdit={false}
          slots={{
            label: () => <></>,
            leadingEditIcon: channelType === ChannelType.EMAIL ? EmailOutlined : PhoneOutlined,
          }}
          slotsProps={{
            textField: {
              sx: { flexBasis: { xs: 'unset', lg: '50%' } },
            },
            button: {
              variant: 'outlined',
              sx: {
                height: '43px',
                fontWeight: 700,
                flexBasis: { xs: 'unset', lg: '25%' },
              },
            },
            container: {
              width: '100%',
            },
            leadingEditIcon: {
              sx: { color: 'text.secondary' },
              fontSize: 'small',
            },
          }}
        />
      </Stack>
    );
  }

  return null;
};

export default CourtesyContactHandler;
