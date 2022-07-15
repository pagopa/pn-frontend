import { createContext, FC, ReactNode, useContext, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface INavigationContext {}

const NavigationContext = createContext<INavigationContext | undefined>(undefined);

const NavigationProvider: FC<ReactNode> = ({ children }) => {
  const [showDialog, _setShowDialog] = useState(false);
  const [title, _setTitle] = useState();
  const [message, _setMessage] = useState();

  const cancelNavigation = () => {

  }

  const confirmNavigation = () => {

  }

  return (
    <NavigationContext.Provider value={{}}>
      <BrowserRouter>
        <Dialog onClose={cancelNavigation} open={showDialog} maxWidth={'xs'} fullWidth>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{message}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={cancelNavigation}>
              Annulla
            </Button>
            <Button variant="contained" onClick={confirmNavigation} autoFocus>
              Esci
            </Button>
          </DialogActions>
        </Dialog>
        {children}
      </BrowserRouter>
    </NavigationContext.Provider>
  );
};

const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

export { NavigationProvider, useNavigationContext };
