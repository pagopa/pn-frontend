import { useState, Fragment } from 'react';
import { Alert, Grid, Typography, Box, IconButton, AlertProps } from '@mui/material'; // SvgIcon
import { Theme, styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ReportGmailerrorredOutlinedIcon from '@mui/icons-material/ReportGmailerrorredOutlined';

import { MessageType } from './types';

type Props = {
  open: boolean;
  title: string;
  type: MessageType;
  message: React.ReactNode;
  closingDelay?: number;
  onClose?: () => void;
};

const CustomAlert = styled(Alert)({
  '.MuiAlert-icon': { display: 'none' },
});

export default function Toast({ title, message, open, type, closingDelay, onClose }: Props) {
  const [openStatus, setOpenStatus] = useState(open);

  const closeToast = () => {
    setOpenStatus(false);
    if (onClose) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case MessageType.ERROR:
        return <ReportGmailerrorredOutlinedIcon />;
      case MessageType.WARNING:
        return <WarningAmberOutlinedIcon />;
      case MessageType.SUCCESS:
        return <CheckCircleOutlineOutlinedIcon />;
      case MessageType.INFO:
        return <InfoOutlinedIcon />;
    }
  }

  const getColor = (theme: Theme): string => {
    switch (type) {
      case MessageType.ERROR:
        return `4px solid ${theme.palette.error.main} !important`;
      case MessageType.WARNING:
        return `4px solid ${theme.palette.warning.main} !important`;
      case MessageType.SUCCESS:
        return `4px solid ${theme.palette.success.main} !important`;
      case MessageType.INFO:
        return `4px solid ${theme.palette.info.main} !important`;
      default:
        return `4px solid !important`;
    }
  }

  if (closingDelay) {
    setTimeout(() => {
      closeToast();
    }, closingDelay);
  }
  
  return (
    <Fragment>
      {openStatus && (
      <Grid container justifyContent="end" px={2} data-testid="toastContainer">
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Box sx={{}}>
            <CustomAlert
              className="userToast"
              variant="outlined"
              sx={{
                position: 'fixed',
                bottom: '64px',
                right: '64px',
                zIndex: 100,
                width: '376px',
                backgroundColor: 'white',
                borderLeft: getColor,
                borderRadius: '5px',
                boxShadow: '0px 0px 45px rgba(0, 0, 0, 0.1) ',
                border: 'none',
              } as AlertProps}
            >
              <Grid container>
                <Grid item xs={2}>
                  {getIcon()}
                </Grid>
                <Grid item xs={8}>
                  <Typography pb={1} sx={{ fontSize: '15px', fontWeight: '600' }}>
                    {title}
                  </Typography>
                  <Typography>{message}</Typography>
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={closeToast}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CustomAlert>
          </Box>
        </Grid>
      </Grid>)}
    </Fragment>
  );
}
