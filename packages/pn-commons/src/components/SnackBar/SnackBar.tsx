import { Alert, Snackbar, IconButton, AlertTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../../hooks/useIsMobile';
import { MessageType } from '../../types/MessageType';

type Props = {
  /** whether the sneakbar should be open or not */
  open: boolean;
  /** message type (error, success, info, warning) */
  type: MessageType;
  /** title to be shown */
  title?: React.ReactNode;
  /** message to be shown */
  message: React.ReactNode;
  /** A closing delay: if specified the sneakbar would close itself */
  closingDelay?: number;
  /** onClose action */
  onClose?: () => void;
  variant?: 'outlined' | 'standard' | 'filled';
};

const SnackBar = ({
  title,
  message,
  open,
  type,
  closingDelay,
  onClose,
  variant = 'outlined',
}: Props) => {
  const [openStatus, setOpenStatus] = useState(open);
  const isMobile = useIsMobile();

  const closeSnackBar = () => {
    setOpenStatus(false);
    if (onClose) {
      onClose();
    }
  };

  // create timer for closing snackbar after *closingDelay* milliseconds
  useEffect(() => {
    if (closingDelay && openStatus) {
      const timer = setTimeout(() => {
        closeSnackBar();
      }, closingDelay);
      return () => clearTimeout(timer);
    }
    // since it returns in a conditional branch, it must return in all cases
    return;
  }, []);

  const getColor = new Map<MessageType, 'error' | 'warning' | 'success' | 'info'>([
    [MessageType.ERROR, 'error'],
    [MessageType.WARNING, 'warning'],
    [MessageType.SUCCESS, 'success'],
    [MessageType.INFO, 'info'],
  ]);

  const action = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackBar}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      {openStatus && (
        <div data-testid="snackBarContainer">
          <Snackbar open={open} action={action}>
            <Alert
              onClose={closeSnackBar}
              severity={getColor.get(type)}
              sx={{
                position: 'fixed',
                bottom: '64px',
                right: isMobile ? '5%' : '64px',
                zIndex: 100,
                width: isMobile ? 'calc(100vw - 10%)' : '376px',
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
              variant={variant}
            >
              {title && <AlertTitle>{title}</AlertTitle>}
              {message}
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
};

export default SnackBar;
