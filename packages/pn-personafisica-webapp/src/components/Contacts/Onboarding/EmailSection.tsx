import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { EmailContactState } from '../../../models/Onboarding';
import { ChannelType } from '../../../models/contacts';
import DigitalContact from '../DigitalContact';
import OnboardingContactItem from './OnboardingContactItem';

export type EmailMode = 'collapsed' | 'insert' | 'readonly' | 'edit';

type Props = {
  mode: EmailMode;
  email: EmailContactState;
  emailValue: string;
  emailError?: string;
  emailTouched?: boolean;
  onEmailValueChange: (value: string) => void;
  onEmailBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onVerifyEmail: () => void | Promise<void>;
  onSubmitEmailEdit: (value: string) => void;
  onExpand: () => void;
  onCollapse: () => void;
  emailContactRef: RefObject<{
    toggleEdit: () => void;
    resetForm: () => Promise<void>;
  }>;
  onEditButtonClickCallback?: (nextEditMode: boolean) => void;
  onEditConfirmCallback?: () => void;
};

const EmailSection: React.FC<Props> = ({
  mode,
  email,
  emailValue,
  emailError,
  emailTouched,
  onEmailValueChange,
  onEmailBlur,
  onVerifyEmail,
  onSubmitEmailEdit,
  onExpand,
  onCollapse,
  emailContactRef,
  onEditButtonClickCallback,
  onEditConfirmCallback,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);

  if (mode === 'collapsed') {
    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {t('onboarding.digital-domicile.pec.optional-email-description')}
        </Typography>

        <ButtonNaked
          color="primary"
          size="medium"
          onClick={onExpand}
          sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
        >
          {t('onboarding.digital-domicile.pec.email-cta')}
        </ButtonNaked>
      </Stack>
    );
  }

  if (mode === 'insert') {
    return (
      <OnboardingContactItem
        mode="entry"
        title={t('onboarding.digital-domicile.pec.optional-email-title')}
        label={t('onboarding.digital-domicile.pec.optional-email-label')}
        inputLabel={t('onboarding.digital-domicile.email.input-label')}
        value={emailValue}
        buttonLabel={t('onboarding.digital-domicile.email.verify-cta')}
        buttonVariant="outlined"
        error={emailError}
        touched={emailTouched}
        onChange={onEmailValueChange}
        onBlur={onEmailBlur}
        onSubmit={onVerifyEmail}
        collapse={{
          label: t('onboarding.digital-domicile.pec.cancel-email-cta'),
          onClick: onCollapse,
        }}
        prefix={<MailOutlineIcon fontSize="small" color="disabled" />}
      />
    );
  }

  if (mode === 'readonly' && email.value && !email.alreadySet) {
    return (
      <OnboardingContactItem
        mode="view"
        description={t('onboarding.digital-domicile.pec.email-present-description')}
        value={email.value}
        icon={<MailOutlineIcon color="disabled" fontSize="small" aria-hidden="true" />}
      />
    );
  }

  if (mode === 'edit') {
    return (
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {t('onboarding.digital-domicile.pec.email-present-description')}
        </Typography>

        <DigitalContact
          ref={emailContactRef}
          label=""
          value={email.value ?? ''}
          channelType={ChannelType.EMAIL}
          inputProps={{
            label: t('onboarding.digital-domicile.email.input-label'),
          }}
          insertButtonLabel={t('onboarding.digital-domicile.email.confirm-cta')}
          onSubmit={onSubmitEmailEdit}
          showLabelOnEdit={false}
          slots={{
            label: () => <></>,
            leadingEditIcon: MailOutlineIcon,
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
          onEditButtonClickCallback={onEditButtonClickCallback}
          onEditConfirmCallback={onEditConfirmCallback}
        />
      </Stack>
    );
  }

  return null;
};

export default EmailSection;
