import { Stack, styled, Typography } from '@mui/material';
import { SentimentDissatisfied } from '@mui/icons-material';
import { useEffect, useState } from 'react';

type TableErrorProps = {
  httpErrorNumber?: number;
};

const StyledStack = styled(Stack)`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;

const TableError: React.FC<TableErrorProps> = ({ httpErrorNumber }) => {
  const [errorDescription, setErrorDescription] = useState('');

  useEffect(() => {
    switch (httpErrorNumber) {
      case 500:
        setErrorDescription('Si è verificato un errore ai server. Si prega di riprovare più tardi');
        break;
      default:
        setErrorDescription('Si è verificato un errore generico. Si prega di riprovare più tardi');
        break;
    }
  }, []);

  return (
    <StyledStack
      sx={{ fontSize: '16px' }}
      direction={'row'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <SentimentDissatisfied
        fontSize={'small'}
        sx={{ verticalAlign: 'middle', margin: '0 20px' }}
      />
      <Typography sx={{ marginRight: '8px' }}>{errorDescription}</Typography>
    </StyledStack>
  );
};

export default TableError;
