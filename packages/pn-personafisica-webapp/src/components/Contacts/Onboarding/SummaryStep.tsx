import { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Chip, Link, Stack, Typography } from '@mui/material';
import { MIAlert } from '@pagopa/mui-italia';

import { WizardMode } from '../../../models/Onboarding';
import { IOAllowedValues } from '../../../models/contacts';
import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../../navigation/routes.const';
import OnboardingContactItem from './OnboardingContactItem';

type Props = {
  mode: WizardMode;
  email?: string;
  pec?: string;
  io?: IOAllowedValues;
};

type SummaryRow = {
  id: string;
  label: string;
  value?: ReactNode;
  secondaryContent?: ReactNode;
};

const SummaryStep: React.FC<Props> = ({ mode, email, pec, io }) => {
  const { t } = useTranslation(['recapiti']);

  const sendLabel = t('onboarding.digital-domicile.summary.send-badge');
  const pecLabel = t('onboarding.digital-domicile.summary.pec-badge');

  const legalRow: SummaryRow =
    mode === 'send'
      ? {
          id: 'sercqSend',
          label: t('onboarding.digital-domicile.summary.ddom-label'),
          secondaryContent: (
            <Chip
              label={sendLabel}
              size="small"
              sx={{ mt: 0.75, '& .MuiChip-label': { fontSize: '12px' } }}
            />
          ),
        }
      : {
          id: 'pec',
          label: t('onboarding.digital-domicile.summary.ddom-label'),
          value: pec,
          secondaryContent: <Chip label={pecLabel} size="small" sx={{ mt: 0.75 }} />,
        };

  const courtesyRows: Array<SummaryRow> = [
    ...(io === IOAllowedValues.ENABLED
      ? [
          {
            id: 'io',
            label: t('onboarding.digital-domicile.summary.io-label'),
            value: t('onboarding.digital-domicile.summary.io-value'),
          },
        ]
      : []),
    ...(email
      ? [
          {
            id: 'email',
            label: t('onboarding.digital-domicile.summary.email-label'),
            value: email,
          },
        ]
      : []),
  ];

  return (
    <Stack data-testid="summary-step">
      <Typography fontSize="18px" fontWeight={700} mb={1}>
        {t('onboarding.digital-domicile.summary.title')}
      </Typography>

      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {t('onboarding.digital-domicile.summary.legal-title')}
        </Typography>
        <OnboardingContactItem
          mode="view"
          label={legalRow.label}
          value={legalRow.value}
          secondaryContent={legalRow.secondaryContent}
        />
      </Stack>
      {courtesyRows.length > 0 && (
        <Stack spacing={2} my={3}>
          <Typography variant="body2" color="text.secondary">
            {t('onboarding.digital-domicile.summary.courtesy-title')}
          </Typography>

          <Stack spacing={2}>
            {courtesyRows.map((row) => (
              <OnboardingContactItem
                mode="view"
                key={row.id}
                label={row.label}
                value={row.value}
                secondaryContent={row.secondaryContent}
              />
            ))}
          </Stack>
        </Stack>
      )}
      <MIAlert
        data-testid="onboardingDDomAlert"
        severity="info"
        description={t('onboarding.digital-domicile.summary.info-box')}
      />
      {mode === 'send' && (
        <Typography mt={1} variant="body2" fontSize="14px" color="text.secondary">
          <Trans
            i18nKey="onboarding.digital-domicile.summary.disclaimer"
            ns="recapiti"
            components={[
              <Link
                key="privacy-policy"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none !important',
                  fontWeight: 'bold',
                }}
                data-testid="privacy-link"
                href={PRIVACY_POLICY}
                target="_blank"
                rel="noopener"
              />,

              <Link
                key="tos"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none !important',
                  fontWeight: 'bold',
                }}
                data-testid="tos-link"
                href={TERMS_OF_SERVICE_SERCQ_SEND}
                target="_blank"
                rel="noopener"
              />,
            ]}
          />
        </Typography>
      )}
    </Stack>
  );
};

export default SummaryStep;
