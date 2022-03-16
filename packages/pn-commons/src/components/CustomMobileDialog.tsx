import { forwardRef, Fragment, ReactElement, ReactNode, Ref, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { CustomDialogAction } from '../types/CustomMobileDialog';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobileDialog = styled(Dialog)(() => ({
  '& .MuiDialog-container': {
    height: 'auto',
    bottom: 0,
    position: 'absolute',
    width: '100%',
  },
  '& .MuiPaper-root': {
    borderRadius: '24px 24px 0px 0px',
  },
  '& .MuiDialogContent-root': {
    paddingTop: '20px !important',
  },
  '& .MuiDialogActions-root': {
    display: 'block',
    textAlign: 'center',

    '.MuiButton-root': {
      width: '80%',
      margin: '10px 0',
    },
  },
}));

type Props = {
  title: string;
  children?: ReactNode;
  actions?: Array<CustomDialogAction>;
};

const CustomMobileSort = ({ title, actions, children }: Props) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleActionClick = (action: CustomDialogAction) => {
    if (action.closeOnClick) {
      handleClose();
    }
  };

  return (
    <Fragment>
      <Button onClick={handleClickOpen} sx={{ pr: 0 }}>
        {title}
      </Button>
      <MobileDialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        fullScreen
        aria-labelledby={title}
        data-testid="mobileDialog"
      >
        <DialogTitle>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={6}>
              <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: '700' }}>
                {title}
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <CloseIcon
                onClick={handleClose}
                sx={{
                  position: 'relative',
                  right: 0,
                  top: 4,
                  color: 'action.active',
                  width: '32px',
                  height: '32px',
                }}
              />
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>{children}</DialogContent>
        {actions && <DialogActions>
          {actions.map(a => <Box data-testid="dialogAction" onClick={() => handleActionClick(a)} key={a.key}>{a.component}</Box>)}  
        </DialogActions>}
      </MobileDialog>
    </Fragment>
  );
};

export default CustomMobileSort;
