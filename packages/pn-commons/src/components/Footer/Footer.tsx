import { Box, Grid, Link, SvgIcon, Typography } from '@mui/material';
import { ReactComponent as logo } from '../../assets/logo_pago_pa.svg';

type Props = {
  /** The email to which the assistance button will ask to send an email */
  assistanceEmail?: string;
};

const Footer = ({ assistanceEmail }: Props) => (
  <Box
    component="footer"
    sx={{
      pt: '32px',
      height: '156px',
      mt: 'auto',
      bgcolor: 'primary.dark',
      alignItems: 'center',
      boxSizing: 'unset',
      position: 'relative',
    }}
  >
    <Grid container justifyContent={'center'} alignItems={'center'}>
      <Box sx={{ width: '90%', display: 'flex' }}>
        <SvgIcon component={logo} viewBox="0 0 140 33" sx={{ width: '119px' }} />
        <Box sx={{ textAlign: 'end', flexGrow: 1 }} pl={8}>
          <Typography
            component="div"
            sx={{
              fontWeight: 'normal',
              fontSize: '15px',
              lineHeight: '22,82px',
              textAlign: 'left',
              color: 'background.default',
              paddingLeft: '0px',
            }}
          >
            PagoPA S.p.A. - società per azioni con socio unico - capitale sociale di euro 1,000,000
            interamente versato - sede legale in Roma, Piazza Colonna 370, CAP 00187 -
            <br />
            n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
          </Typography>
        </Box>
      </Box>
    </Grid>
    <Grid
      container
      alignItems={'center'}
      justifyContent={'center'}
      sx={{ position: 'absolute', bottom: '48px' }}
    >
      <Box sx={{ width: '90%', display: 'flex' }} data-testid="linksContainer">
        <Typography
          sx={{
            fontWeight: 'normal',
            fontSize: '15px',
            lineHeight: '15px',
            textAlign: 'left',
            padding: '0px',
          }}
          component="div"
        >
          <Link
            href="https://www.pagopa.it/it/privacy-policy/"
            underline="none"
            sx={{
              marginRight: '10px',
              color: '#9BB7CB !important',
              textDecoration: 'none !important',
            }}
          >
            {'Privacy Policy '}
          </Link>
          <Link
            href="https://www.pagopa.it/it/termini-e-condizioni-di-utilizzo-del-sito/"
            underline="none"
            sx={{
              margin: '10px',
              color: '#9BB7CB !important',
              textDecoration: 'none !important',
            }}
          >
            {'Termini e condizioni d’uso del sito '}
          </Link>
          <Link
            href="https://www.pagopa.it/static/781646994f1f8ddad2d95af3aaedac3d/Sicurezza-delle-informazioni_PagoPA-S.p.A..pdft"
            underline="none"
            sx={{
              marginRight: '10px',
              color: '#9BB7CB !important',
              textDecoration: 'none !important',
            }}
          >
            {'Sicurezza delle informazioni '}
          </Link>
          {assistanceEmail && (
            <Link
              href={`mailto:${assistanceEmail}`}
              underline="none"
              sx={{
                margin: '10px',
                color: '#9BB7CB !important',
                textDecoration: 'none !important',
              }}
            >
              {'Assistenza '}
            </Link>
          )}
        </Typography>
      </Box>
    </Grid>
  </Box>
);

export default Footer;
