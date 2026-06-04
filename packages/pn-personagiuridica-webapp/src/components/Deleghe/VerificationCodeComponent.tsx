import { useTranslation } from 'react-i18next';

import { Box, Stack } from '@mui/material';
import { CopyToClipboard } from '@pagopa-pn/pn-commons';
import { CodeInput } from '@pagopa/mui-italia';

interface VerificationCodeProps {
  code: string;
}

const VerificationCodeComponent = ({ code }: VerificationCodeProps) => {
  const { t } = useTranslation('deleghe');

  return (
    <Box data-testid="verificationCode">
      <Stack direction="row" spacing={1} alignItems="center">
        <CodeInput
          length={code.length}
          value={code}
          readOnly
          inputMode="numeric"
          onChange={() => undefined}
          ariaLabel={t('deleghe.verification_code')}
        />

        <CopyToClipboard getValue={() => code} tooltipMode tooltip={t('deleghe.code_copied')} />
      </Stack>
    </Box>
  );
};

export default VerificationCodeComponent;
