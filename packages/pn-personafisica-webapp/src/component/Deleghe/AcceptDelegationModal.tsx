import { ChangeEvent, useState } from 'react';
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
import { Trans, useTranslation } from 'react-i18next';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { useAppDispatch } from '../../redux/hooks';
import { acceptDelegation, closeAcceptModal } from '../../redux/delegation/actions';

const StyledInput = styled(TextField)`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 16px 8px;
  width: 40px;
`;

type Props = {
  open: boolean;
  id: string;
  name: string;
};

const AcceptDelegationModal = ({ open, id, name }: Props) => {
  const { t } = useTranslation(['deleghe']);
  const isMobile = useIsMobile();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const dispatch = useAppDispatch();
  const fieldsArray = Array.from({ length: 5 }, (_, index) => index + 1);
  const [code, setCode] = useState<Array<string>>(['', '', '', '', '']);

  const handleClose = () => {
    dispatch(closeAcceptModal());
  };

  const handleConfirm = () => {
    void dispatch(acceptDelegation({ id, code: code.join('') }));
  };

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>, idx: number) {
    const next = [...code.slice(0, idx), e.target.value, ...code.slice(idx + 1, code.length)];
    setCode(next);
    if (e.target.value && idx < 4) {
      const target = document.getElementById(`input-${idx + 1}`);
      if (target) {
        target.focus();
      }
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Grid
        container
        direction="column"
        sx={{ minHeight: '4rem', minWidth: isMobile ? 0 : '32em' }}
      >
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
              <Typography>
                <Trans ns="deleghe" i18nKey="deleghe.accept_description" values={{ name }}>
                  deleghe.accept_description
                </Trans>
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ margin: '16px 0' }} />
          <Typography variant="subtitle2">{t('deleghe.verification_code')}</Typography>
          <Stack direction="row">
            {fieldsArray.map((_, idx) => (
              <StyledInput
                key={idx}
                value={code[idx]}
                id={`input-${idx}`}
                placeholder="-"
                variant="outlined"
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: 24,
                    caretColor: 'transparent',
                  },
                  onClick: (e) =>
                    e.currentTarget.setSelectionRange(
                      e.currentTarget.value.length,
                      e.currentTarget.value.length
                    ),
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
