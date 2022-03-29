import { KeyboardEvent, ChangeEvent, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
  TextField,
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../redux/hooks';
import { acceptDelegation, closeAcceptModal } from '../../redux/delegation/actions';

const StyledInput = styled(TextField)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-right: 8px;
`;

// &input: {
//   padding: 0 8px;
//   font-size: 36px;
//   caret-color: transparent;
//   height: 4rem;
// },

type Props = {
  open: boolean;
  id: string;
};

const AcceptDelegationModal = ({ open, id }: Props) => {
  const { t } = useTranslation(['deleghe']);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const dispatch = useAppDispatch();
  const fieldsArray = Array.from({ length: 5 }, (_, index) => index + 1);
  const [code, setCode] = useState<string>('');

  const handleClose = () => {
    dispatch(closeAcceptModal());
  };

  const handleConfirm = () => {
    // TODO: void dispatch(acceptDelegation({ id, code: digits.join('') }));
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>, idx: number) {
    const next = code + e.target.value;
    setCode(next);
    if (e.target.value && idx < 4) {
      const target = document.getElementById(`input-${idx + 1}`);
      if (target) {
        target.focus();
      }
    }
  }

  const handleCanc = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && idx > 0) {
      const next = code.slice(0, code.length - 1);
      setCode(next);
      const target = document.getElementById(`input-${idx - 1}`);
      if (target) {
        target.focus();
      }
    }
  };

  console.log(code);

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Grid container direction="column" sx={{ minHeight: '4rem', width: '32rem' }}>
        <Box mx={3} sx={{ height: '100%' }}>
          <Grid container item mt={4}>
            <Grid item xs={10}>
              <IconButton
                onClick={handleClose}
                sx={{ position: 'absolute', top: '20px', right: '16px', zIndex: 100 }}
              >
                <ClearOutlinedIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontSize: '18px', fontWeight: '600' }}>
                {t('deleghe.accept_title')}
              </Typography>
              <Typography>{t('deleghe.accept_description')}</Typography>
            </Grid>
          </Grid>
          <Divider />
          <Stack direction="row">
            {fieldsArray.map((_, idx) => (
              <StyledInput
                key={idx}
                id={`input-${idx}`}
                placeholder="-"
                variant="outlined"
                sx={{ width: 48, marginLeft: 1 }}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: 36,
                    caretColor: 'transparent',
                  },
                  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => handleCanc(e, idx),
                }}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleChange(e, idx)}
              />
            ))}
          </Stack>
          <Divider />
          <Stack direction={'row'} justifyContent={'flex-end'} ml={'auto'} my={4}>
            <Grid item mr={1}>
              <Button onClick={handleClose} color="primary" variant="outlined">
                {t('deleghe.close')}
              </Button>
            </Grid>
            <Grid item>
              <Button color="primary" variant="contained" onClick={handleConfirm}>
                {t('deleghe.accept')}
              </Button>
            </Grid>
          </Stack>
        </Box>
      </Grid>
    </Dialog>
  );
};

export default AcceptDelegationModal;
