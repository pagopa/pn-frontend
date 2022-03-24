import { Box, Typography } from '@mui/material';

interface VerificationCodeProps {
  code: string;
}

const VerificationCodeComponent = ({ code }: VerificationCodeProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'row' }}>
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
          marginRight: '8px',
        }}
      >
        <Typography sx={{ color: 'primary.main', fontWeight: 600 }}>{codeDigit}</Typography>
      </Box>
    ))}
  </Box>
);

export default VerificationCodeComponent;
