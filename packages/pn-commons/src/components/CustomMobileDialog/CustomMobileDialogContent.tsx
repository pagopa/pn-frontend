import { forwardRef, ReactElement, ReactNode, Ref } from "react";
import { Dialog, DialogTitle, Grid, Slide, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';

import { useCustomMobileDialogContext } from "./CustomMobileDialog.context";

type Props = {
  children: ReactNode,
  title: string
}

const MobileDialog = styled(Dialog)(() => ({
  '& .MuiDialog-container': {
    height: 'auto',
    bottom: 0,
    position: 'absolute',
    width: '100%'
  },
  '& .MuiPaper-root': {
    borderRadius: '24px 24px 0px 0px',
  },
  '& .MuiDialogContent-root': {
    paddingTop: '20px !important',
    maxHeight: 'calc(100vh - 250px)'
  },
  '& .MuiDialogActions-root': {
    display: 'block',
    textAlign: 'center',
    padding: '20px 24px',

    '.MuiButton-root': {
      width: '100%',
      margin: '10px 0',
    },
  },
}));

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * The content of the dialog (header, body and actions)
 * @param children the react component for the body and the actions
 * @param title title to show in the dialog header
 */
const CustomMobileDialogContent = ({children, title}: Props) => {
  const { open, toggleOpen } = useCustomMobileDialogContext();

  const handleClose = () => {
    toggleOpen();
  }

  return (
    <MobileDialog
      scroll="paper"
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
      {children}
    </MobileDialog>
  );
};

export default CustomMobileDialogContent;
