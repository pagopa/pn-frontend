import { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { EmailContactState } from '../../../models/DigitalDomicileOnboarding';
import { ChannelType } from '../../../models/contacts';
import DigitalContact from '../DigitalContact';
import OnboardingContactItem from './OnboardingContactItem';

export type EmailMode = 'collapsed' | 'insert' | 'readonly' | 'edit';

type Props = {
  mode: EmailMode;
  email: EmailContactState;
  emailDraft: string;
  onEmailDraftChange: (value: string) => void;
  onSubmitEmail: (value: string) => void;
  onExpand: () => void;
  onCollapse: () => void;
  onEdit: () => void;
  emailContactRef: RefObject<{
    toggleEdit: () => void;
    resetForm: () => Promise<void>;
  }>;
};

const EmailSection: React.FC<Props> = ({
  mode,
  email,
  emailDraft,
  onEmailDraftChange,
  onSubmitEmail,
  onExpand,
  onCollapse,
  onEdit,
  emailContactRef,
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
        value={emailDraft}
        buttonLabel={t('onboarding.digital-domicile.email.verify-cta')}
        onChange={onEmailDraftChange}
        onSubmit={() => onSubmitEmail(emailDraft)}
        collapseLabel={t('onboarding.digital-domicile.pec.cancel-email-cta')}
        onCollapse={onCollapse}
      />
    );
  }

  if (mode === 'readonly' && email.value && !email.alreadySet) {
    return (
      <OnboardingContactItem
        mode="view"
        introText={t('onboarding.digital-domicile.pec.email-present-description')}
        value={email.value}
        icon={<MailOutlineIcon color="disabled" fontSize="small" aria-hidden="true" />}
      />
    );
  }

  if (mode === 'readonly' && email.value && email.alreadySet) {
    return (
      <OnboardingContactItem
        mode="view"
        introText={t('onboarding.digital-domicile.pec.email-present-description')}
        value={email.value}
        icon={<MailOutlineIcon color="disabled" fontSize="small" aria-hidden="true" />}
        actionLabel={t('onboarding.digital-domicile.pec.edit-email-cta')}
        onAction={onEdit}
      />
    );
  }

  if (mode === 'edit') {
    return (
      <Stack spacing={2}>
        <Typography fontSize="16px" fontWeight={700}>
          {t('onboarding.digital-domicile.pec.optional-email-title')}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('onboarding.digital-domicile.pec.optional-email-label')}
        </Typography>

        <DigitalContact
          ref={emailContactRef}
          label=""
          value={email.value ?? ''}
          channelType={ChannelType.EMAIL}
          inputProps={{
            label: t('onboarding.digital-domicile.email.input-label'),
          }}
          insertButtonLabel={t('onboarding.digital-domicile.email.verify-cta')}
          onSubmit={onSubmitEmail}
          showLabelOnEdit
          slots={{
            label: () => <></>,
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
          }}
        />
      </Stack>
    );
  }

  return null;
};

export default EmailSection;
