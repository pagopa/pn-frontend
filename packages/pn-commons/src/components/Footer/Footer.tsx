import { Box, Grid, SvgIcon, Typography, Link } from '@mui/material';
import { ReactComponent as logo } from '../../assets/logo_pago_pa.svg';
import { useIsMobile } from '../../hooks/IsMobile.hook';

type Props = {
  /** The email to which the assistance button will ask to send an email */
  assistanceEmail?: string;
};

const Footer = ({ assistanceEmail }: Props) => {
  const isMobile = useIsMobile();
 
  const FooterLink = (link: string, label: string) => (
    <Typography
      sx={{
        fontWeight: 'normal',
        fontSize: '15px',
        lineHeight: '15px',
        textAlign: isMobile ? 'center' : 'left',
        padding: '0px',
      }}
      component="div"
    >
      <Link
        href={link}
        underline="none"
        sx={{
          marginRight: '10px',
          color: '#9BB7CB !important',
          textDecoration: 'none !important',
        }}
      >
        {label}
      </Link>
    </Typography>
  );

  return (
    <Box
      component="footer"
      sx={{
        padding: `32px 5% ${isMobile ? '32px' : 0} 5%`,
        height: isMobile ? 'auto' : '156px',
        mt: 'auto',
        bgcolor: 'primary.dark',
        alignItems: 'center',
        boxSizing: 'unset',
      }}
    >
      <Grid container sx={{position: 'relative'}}>
        <Grid container justifyContent="center" alignItems="center" spacing={2} direction="row">
          <Grid item lg="auto">
            <SvgIcon component={logo} viewBox="0 0 140 33" sx={{ width: '119px' }} />
          </Grid>
          <Grid item lg>
            <Typography
              component="div"
              sx={{
                fontWeight: 'normal',
                fontSize: '15px',
                lineHeight: '22,82px',
                textAlign: isMobile ? 'center' : 'left',
                color: 'background.default',
                paddingLeft: '0px',
              }}
            >
              PagoPA S.p.A. - società per azioni con socio unico - capitale sociale di euro 1,000,000
              interamente versato - sede legale in Roma, Piazza Colonna 370, CAP 00187 -
              <br />
              n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems={'center'}
          sx={{ position: isMobile ? 'unset' : 'absolute', bottom: '-48px', pt: isMobile ? '16px' : 0 }}
          data-testid="linksContainer"
          spacing={2}
          direction="row"
        >
          <Grid item lg="auto" xs={12}>
            {FooterLink('https://www.pagopa.it/it/privacy-policy/', 'Privacy Policy ')}
          </Grid>
          <Grid item lg="auto" xs={12}>
            {FooterLink(
              'https://www.pagopa.it/it/termini-e-condizioni-di-utilizzo-del-sito/',
              'Termini e condizioni d’uso del sito '
            )}
          </Grid>
          <Grid item lg="auto" xs={12}>
            {FooterLink(
              'https://www.pagopa.it/static/781646994f1f8ddad2d95af3aaedac3d/Sicurezza-delle-informazioni_PagoPA-S.p.A..pdft',
              'Sicurezza delle informazioni '
            )}
          </Grid>
          {assistanceEmail && (
            <Grid item lg="auto" xs={12}>
              {FooterLink(`mailto:${assistanceEmail}`, 'Assistenza ')}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
