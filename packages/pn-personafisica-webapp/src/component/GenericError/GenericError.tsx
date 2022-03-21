import { Button, Box, Typography } from '@mui/material';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { useAppDispatch } from '../../redux/hooks';
import { getDelegates, getDelegators } from '../../redux/delegation/actions';

type GenericErrorProps = {
  title?: number;
  description?: number;
};

const GenericError: React.FC<GenericErrorProps> = () => {
  const dispatch = useAppDispatch();

  const retryApiCall = () => {
    void dispatch(getDelegates());
    void dispatch(getDelegators());
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '3rem',
      }}
    >
      <FindInPageIcon sx={{ fontSize: '5rem' }} />
      <Typography variant={'h4'} align={'center'}>
        Spiacenti, qualcosa è andato <br /> storto
      </Typography>
      <Typography align={'center'}>
        Non siamo riusciti ad indirizzarti alla pagina richiesta
      </Typography>
      <Button
        variant="contained"
        sx={{ backgroundColor: '#0173e6', height: '32px', marginTop: '1rem' }}
        onClick={retryApiCall}
      >
        Ricarica la pagina
      </Button>
    </Box>
  );
};

export default GenericError;
