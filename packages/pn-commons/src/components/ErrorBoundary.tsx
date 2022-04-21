import { Component, ErrorInfo, ReactNode } from 'react';

import { Typography, Box, Button, SxProps } from '@mui/material';
import { IllusError } from '@pagopa/mui-italia';

type Props = {
  children: ReactNode;
  sx?: SxProps;
  printError?: boolean;
};

type State = { hasError: boolean };

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
  }

  private handleRefreshPage() {
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{minHeight: '350px', height: '100%', display: 'flex', ...this.props.sx}}>
          <Box sx={{margin: 'auto', textAlign: 'center', width: '80vw'}}>
            <IllusError/>
            <Typography variant="h4" color="text.primary" sx={{margin: '20px 0 10px 0'}}>Qualcosa è andato storto</Typography>
            <Typography variant="body1" color="text.primary">Non siamo riusciti a caricare la pagina. Ricaricala, oppure prova più tardi.</Typography>
            <Button variant="contained" sx={{marginTop: '30px'}} onClick={this.handleRefreshPage}>Ricarica la pagina</Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
