import { Box, Stack, Typography } from '@mui/material';

interface VerificationCodeProps {
  code: string;
}

const VerificationCodeComponent = ({ code }: VerificationCodeProps) => (
  <Box data-testid="verificationCode">
    <Stack direction="row" spacing={1}>
      {code.split('').map((codeDigit: string, i: number) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            borderRadius: '4px',
            borderColor: 'primary.main',
            width: '2.5rem',
            height: '4rem',
            borderWidth: '2px',
            borderStyle: 'solid',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
          data-testid="codeDigit"
        >
          <Typography color="primary" fontWeight={600}>
            {codeDigit}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Box>
);

export default VerificationCodeComponent;
