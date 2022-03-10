import { AppBar, Button, SvgIcon, Toolbar } from '@mui/material';
import { Box } from '@mui/system';
import { Fragment } from 'react';
import { ReactComponent as logo } from '../../assets/logo_pago_pa_mini.svg';
import SubHeader from './subHeader/SubHeader';

type HeaderProps = {
  withSecondHeader: boolean;
  onExitAction?: (() => void) | null;
  subHeaderChild?: React.ReactNode;
};

const Header = ({
  withSecondHeader,
  onExitAction = () => window.location.assign(''),
  subHeaderChild,
}: HeaderProps) => (
  <Fragment>
    <AppBar
      position="relative"
      sx={{
        alignItems: 'center',
        height: '7%',
        backgroundColor: 'primary.dark',
        boxShadow: 'none'
      }}
    >
      <Toolbar sx={{ width: { xs: '100%', lg: '90%', minHeight: '48px !important' } }}>
        <SvgIcon component={logo} viewBox="0 0 80 24" sx={{ width: '80px' }} />
        {onExitAction !== null ? (
          <Box sx={{ flexGrow: 1, textAlign: 'end' }}>
            <Button
              variant="contained"
              sx={{ width: '88px', backgroundColor: '#004C99', height: '32px' }}
              onClick={onExitAction}
            >
              Esci
            </Button>
          </Box>
        ) : (
          ''
        )}
      </Toolbar>
    </AppBar>
    {withSecondHeader === true ? <SubHeader>{subHeaderChild}</SubHeader> : ''}
  </Fragment>
  /*  </Box> */
);

export default Header;
