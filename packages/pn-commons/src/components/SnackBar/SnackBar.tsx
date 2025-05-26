import { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Alert, AlertTitle, Box, IconButton, Snackbar, Typography } from '@mui/material';

import { useIsMobile } from '../../hooks/useIsMobile';
import { AppResponseOutcome } from '../../models/AppResponse';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import CopyToClipboard from '../CopyToClipboard';
import { IAppMessage } from '../../models';

type Props = {
  /** whether the sneakbar should be open or not */
  open: boolean;
  /** message type (error, success, info, warning) */
  type: AppResponseOutcome;
  /** the IAppMessage object which contains the info to be shown */
  message: IAppMessage;
  /** countdown in millisecs to auto-hide the SnackBar (no auto-hide if undefined) */
  closingDelay?: number;
  /** onClose action */
  onClose?: () => void;
  /** Alert variant */
  variant?: 'outlined' | 'standard' | 'filled';
};

const SnackBar: React.FC<Props> = ({
  message,
  open,
  type,
  closingDelay,
  onClose,
  variant = 'outlined',
}) => {
  const { title, message: content, showTechnicalData, traceId, errorCode } = message;
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
    // eslint-disable-next-line sonarjs/no-redundant-jump
    return;
  }, []);

  const getColor = new Map<AppResponseOutcome, 'error' | 'warning' | 'success' | 'info'>([
    [AppResponseOutcome.ERROR, 'error'],
    [AppResponseOutcome.WARNING, 'warning'],
    [AppResponseOutcome.SUCCESS, 'success'],
    [AppResponseOutcome.INFO, 'info'],
  ]);

  const action = (
    <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackBar}>
      <CloseIcon fontSize="small" />
    </IconButton>
  );

  const getWidth = (): string => {
    if(isMobile){
      return 'calc(100vw - 5%)';
    };
    
    return showTechnicalData ? '500px' : '376px';
  };

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
                width: getWidth(),
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
              variant={variant}
            >
              {title && <AlertTitle id="alert-api-status">{title}</AlertTitle>}
              {content}
              {showTechnicalData && (
                <Box mt={2} sx={{
                  backgroundColor: '#F2F2F2',
                  p: 2,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                }}>
                  <Typography fontSize="16" variant="body1" fontWeight="600" mb={2}>
                    {getLocalizedOrDefaultLabel(
                      'common',
                      'errors.technical-error.title',
                      'Informazioni errore'
                    )}
                  </Typography>
                  <Box mb={2}>
                    {errorCode && <Typography variant="body1">
                      {errorCode}
                    </Typography>}
                    {traceId && <Typography variant="body1" fontSize="16px">
                      {traceId}
                    </Typography>}
                  </Box>
                  <CopyToClipboard
                    text={getLocalizedOrDefaultLabel(
                      'common',
                      'errors.technical-error.copy-to-clipboard',
                      'Copia informazioni errore'
                    )}
                    getValue={() => errorCode + "\n" + traceId}
                    tooltipMode
                    textPosition='start'
                 />
                </Box>
              )}
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
};

export default SnackBar;
