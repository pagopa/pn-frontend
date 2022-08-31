import { Stack, styled, Typography } from '@mui/material';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

type ApiErrorProps = {
  onClick: () => void;
};

const StyledStack = styled(Stack)`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;

const ApiError: React.FC<ApiErrorProps> = ({ onClick }) => {
  const testo = 'Non siamo riusciti a recuperare questi dati.';
  const testoAzione = 'Ricarica';

  return (
    <StyledStack
      sx={{ fontSize: '16px' }}
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <ReportGmailerrorredIcon
        fontSize={'small'}
        sx={{ verticalAlign: 'middle', margin: '0 20px' }}
      />
      <Typography sx={{ marginRight: '8px' }}>{testo}</Typography>
      <Typography color="primary" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={onClick}>
        {testoAzione}
      </Typography>
    </StyledStack>
  );
};

export default ApiError;
