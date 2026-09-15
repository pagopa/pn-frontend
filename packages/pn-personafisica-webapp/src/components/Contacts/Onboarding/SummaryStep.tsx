import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Typography } from '@mui/material';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { MIAlert, MIChip } from '@pagopa/mui-italia';

import { WizardMode } from '../../../models/Onboarding';
import { IOAllowedValues } from '../../../models/contacts';
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
  const isMobile = useIsMobile();

  const sendLabel = t('onboarding.digital-domicile.summary.send-badge');
  const pecLabel = t('onboarding.digital-domicile.summary.pec-badge');

  const isSendFlow = mode === 'send';

  const legalRow: SummaryRow = isSendFlow
    ? {
        id: 'sercqSend',
        label: t('onboarding.digital-domicile.summary.ddom-label'),
        secondaryContent: (
          <MIChip label={sendLabel} sx={{ mt: 0.75, '& .MuiChip-label': { fontSize: '12px' } }} />
        ),
      }
    : {
        id: 'pec',
        label: t('onboarding.digital-domicile.summary.ddom-label'),
        value: pec,
        secondaryContent: <MIChip label={pecLabel} sx={{ mt: 0.75 }} />,
      };

  const courtesyRows: Array<SummaryRow> = [
    ...(email
      ? [
          {
            id: 'email',
            label: t('onboarding.digital-domicile.summary.email-label'),
            value: email,
          },
        ]
      : []),
    ...(io === IOAllowedValues.ENABLED
      ? [
          {
            id: 'io',
            label: t('onboarding.digital-domicile.summary.io-label'),
            value: t('onboarding.digital-domicile.summary.io-value'),
          },
        ]
      : []),
  ];

  return (
    <Stack data-testid="summary-step">
      <Typography fontSize="18px" fontWeight={700} mb={1}>
        {t('onboarding.digital-domicile.summary.title')}
      </Typography>

      <Stack spacing={2} mb={3}>
        <Typography variant="body2" color="text.secondary">
          {t(`onboarding.digital-domicile.summary.legal-title-${isSendFlow ? 'sercq' : 'pec'}`)}
        </Typography>
        <OnboardingContactItem
          mode="view"
          label={legalRow.label}
          value={legalRow.value}
          secondaryContent={legalRow.secondaryContent}
        />
      </Stack>
      {courtesyRows.length > 0 && (
        <Stack spacing={2} mb={3}>
          <Typography variant="body2" color="text.secondary">
            {t('onboarding.digital-domicile.summary.courtesy-title')}
          </Typography>

          <Stack spacing={2} direction={isMobile ? 'column' : 'row'}>
            {courtesyRows.map((row) => (
              <OnboardingContactItem
                mode="view"
                key={row.id}
                label={row.label}
                value={row.value}
                secondaryContent={row.secondaryContent}
                slotProps={{
                  container: {
                    sx: {
                      flex: isMobile ? '1 1 100%' : '1 1 50%',
                    },
                  },
                }}
              />
            ))}
          </Stack>
        </Stack>
      )}
      <MIAlert data-testid="onboardingDDomAlert" severity="info">
        {t('onboarding.digital-domicile.summary.info-box')}
      </MIAlert>
    </Stack>
  );
};

export default SummaryStep;
